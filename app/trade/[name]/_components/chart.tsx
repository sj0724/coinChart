'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { Candle } from '@/types/chart';

interface Props {
  symbol: string;
}

export default function Chart({ symbol }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<Candle | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  const fetchNewCandles = async () => {
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
    endTimeRef.current = newCandle[0].time as number;
    return newCandle;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: 750,
      height: 500,
    });

    const candleSeries = chart.addSeries(CandlestickSeries);

    const fetchCandles = async () => {
      const data = await fetch(
        `http://localhost:3000/api/chart?name=${symbol}`
      );
      const result = await data.json();

      const formattedData: Candle[] = result.map((candle: any) => ({
        time: candle[0] / 1000, // UNIX timestamp (초 단위)
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));

      candleSeries.setData(formattedData);
      endTimeRef.current = formattedData[0].time as number;
    };

    chart.subscribeCrosshairMove((param) => {
      const data = param.seriesData.get(candleSeries);
      if (data) {
        setHoverData(data as Candle);
      }
    });

    chart.timeScale().subscribeVisibleTimeRangeChange(async (timeRange) => {
      if (!timeRange || !endTimeRef.current || isLoadingRef.current) return;

      if (Number(timeRange.from) <= endTimeRef.current) {
        const result = await fetchNewCandles();

        if (result.length > 1) {
          const oldData = candleSeries.data(); // 기존 데이터 가져오기
          // 기존 데이터의 time 값들을 Set에 저장
          const existingTimes = new Set(oldData.map((c) => c.time));

          // 기존 데이터와 중복되지 않는 새 데이터만 추가
          const filteredNewCandles = result.filter(
            (c: any) => !existingTimes.has(c.time)
          );
          // 시간 정렬
          const sortedData = [...filteredNewCandles, ...oldData].sort(
            (a, b) => a.time - b.time
          );
          candleSeries.setData(sortedData);
          endTimeRef.current = sortedData[0].time;
          isLoadingRef.current = false;
        } else {
          endTimeRef.current = null;
        }
      }
    });
    fetchCandles();

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div className='relative'>
      {hoverData && (
        <div className='absolute top-0 w-full p-4 rounded-md z-30 flex gap-5 text-sm'>
          <p>{new Date(Number(hoverData.time) * 1000).toLocaleDateString()}</p>
          {Object.keys(hoverData)
            .filter((key) => key !== 'time')
            .map((key) => {
              const value = hoverData[key as keyof Candle];
              const textColor =
                hoverData.open > hoverData.close
                  ? 'text-red-600'
                  : 'text-green-500';
              return (
                <p key={key}>
                  {key} : <span className={textColor}>{value.toString()}</span>
                </p>
              );
            })}
        </div>
      )}
      <div ref={chartRef} className='border rounded-md p-5' />
    </div>
  );
}
