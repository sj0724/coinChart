'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { Candle, Volume } from '@/types/chart';
import { numberWithUnit } from '@/utils/numberWithUnit';

interface Props {
  symbol: string;
}

type HoverData = {
  candle: Candle;
  line: Volume;
};

export default function Chart({ symbol }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  const fetchNewChartData = async () => {
    isLoadingRef.current = true;
    const endTime = endTimeRef.current ? endTimeRef.current * 1000 : '';
    const data = await fetch(
      `http://localhost:3000/api/chart?name=${symbol}&endTime=${endTime}`
    );
    const result = await data.json();
    const newCandle = result.map((candle: any) => ({
      time: candle[0] / 1000, // UNIX timestamp (초 단위)
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }));
    const newHistogram = result.map((histogram: any) => ({
      time: histogram[0] / 1000,
      value: parseFloat(histogram[5]),
    }));
    endTimeRef.current = newCandle[0].time as number;
    return { candle: newCandle, histogram: newHistogram };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: 750,
      height: 500,
      layout: {
        background: { color: 'white' },
        textColor: '#333',
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries);
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#2962FF',
      priceScaleId: '',
    });

    const fetchChartData = async () => {
      const data = await fetch(
        `http://localhost:3000/api/chart?name=${symbol}`
      );
      const result = await data.json();

      const formattedCandleData: Candle[] = result.map((candle: any) => ({
        time: candle[0] / 1000, // UNIX timestamp (초 단위)
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));
      const formattedLineData = result.map((line: any) => ({
        time: line[0] / 1000,
        value: parseFloat(line[5]),
      }));

      candleSeries.setData(formattedCandleData);
      lineSeries.setData(formattedLineData);
      endTimeRef.current = formattedCandleData[0].time as number;
    };

    chart.subscribeCrosshairMove((param) => {
      const candleData = param.seriesData.get(candleSeries);
      const lineData = param.seriesData.get(lineSeries);
      if (candleData && lineData) {
        setHoverData({
          candle: candleData as Candle,
          line: lineData as Volume,
        });
      }
    });

    chart.timeScale().subscribeVisibleTimeRangeChange(async (timeRange) => {
      if (!timeRange || !endTimeRef.current || isLoadingRef.current) return;

      if (Number(timeRange.from) <= endTimeRef.current) {
        const result = await fetchNewChartData();

        if (result.candle.length > 1) {
          const oldCandleData = candleSeries.data(); // 기존 데이터 가져오기
          const oldLineData = lineSeries.data();
          // 기존 데이터의 time 값들을 Set에 저장
          const existingTimes = new Set(oldCandleData.map((c) => c.time));

          // 기존 데이터와 중복되지 않는 새 데이터만 추가
          const filteredNewCandles = result.candle.filter(
            (c: any) => !existingTimes.has(c.time)
          );
          const filteredNewHistograms = result.histogram.filter(
            (c: any) => !existingTimes.has(c.time)
          );
          // 시간 정렬
          const sortedCandleData = [
            ...filteredNewCandles,
            ...oldCandleData,
          ].sort((a, b) => a.time - b.time);
          const sortedLineData = [
            ...filteredNewHistograms,
            ...oldLineData,
          ].sort((a, b) => a.time - b.time);

          candleSeries.setData(sortedCandleData);
          lineSeries.setData(sortedLineData);
          endTimeRef.current = sortedCandleData[0].time;
          isLoadingRef.current = false;
        } else {
          endTimeRef.current = null;
        }
      }
    });
    fetchChartData();

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div className='relative'>
      {hoverData && (
        <div className='absolute top-0 w-full p-4 rounded-md z-30 flex text-sm gap-3 text-gray-600'>
          <p>
            {new Date(
              Number(hoverData.candle.time) * 1000
            ).toLocaleDateString()}
          </p>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-5'>
              {Object.keys(hoverData.candle)
                .filter((key) => key !== 'time')
                .map((key) => {
                  const value = hoverData.candle[key as keyof Candle];
                  const textColor =
                    hoverData.candle.open > hoverData.candle.close
                      ? 'text-red-600'
                      : 'text-green-500';
                  return (
                    <p key={key}>
                      {key} :{' '}
                      <span className={textColor}>{value.toString()}</span>
                    </p>
                  );
                })}
            </div>
            <p>
              volume :{' '}
              <span className='text-blue-600'>
                {numberWithUnit(hoverData.line.value)}
              </span>
            </p>
          </div>
        </div>
      )}
      <div ref={chartRef} className='border rounded-md p-5' />
    </div>
  );
}
