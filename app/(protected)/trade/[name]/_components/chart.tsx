'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { Candle, Volume } from '@/types/chart';
import { numberWithUnit } from '@/utils/numberWithUnit';
import IntervalMenu from './intervalMenu';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchChartData } from '@/app/api/chart/helper';
import { DEFAULT_STALE_TIME, LIMIT } from '@/lib/constance';
import { INTERVAL_OPTIONS } from '@/types/sort';

interface Props {
  symbol: string;
}

type HoverData = {
  candle: Candle;
  line: Volume;
};

// 차트 범위 설정을 위한 옵션
const INTERVAL_OPTION = {
  '1w': 3600 * 24 * 700,
  '1d': 3600 * 24 * 100,
  '4h': 3600 * 24 * 14,
  '1h': 3600 * 24 * 6,
  '15m': 3600 * 24 * 2,
  '3m': 3600 * 6,
};

export default function Chart({ symbol }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<HoverData | null>(null);
  const isEndRef = useRef(false);
  const isLoadingRef = useRef(false);
  const [chartInterval, setChartInterval] = useState<INTERVAL_OPTIONS>('1w');

  const changeInterval = (value: INTERVAL_OPTIONS) => {
    setChartInterval(value);
  };

  const { data: infiniteData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['chart', symbol, chartInterval],
    queryFn: ({ pageParam }: { pageParam?: string | null }) =>
      fetchChartData(chartInterval, symbol, LIMIT, pageParam),
    staleTime: DEFAULT_STALE_TIME,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.candle?.[0]?.time ?? undefined,
  });

  useEffect(() => {
    if (!chartRef.current || !infiniteData) return;
    isEndRef.current = false;

    // limit값보다 작으면 추가 데이터 없음
    if (
      infiniteData.pages[infiniteData.pages.length - 1].candle.length < LIMIT
    ) {
      isEndRef.current = true;
    }

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth - 200,
      height: 550,
      layout: {
        background: { color: 'white' },
        textColor: 'black',
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
      lineWidth: 2,
    });
    const allCandles = infiniteData.pages
      .flatMap((page) => page.candle)
      .sort((a, b) => a.time - b.time)
      .filter((value, index, self) => {
        return index === 0 || value.time !== self[index - 1].time;
      });

    const allHistograms = infiniteData.pages
      .flatMap((page) => page.histogram)
      .sort((a, b) => a.time - b.time)
      .filter((value, index, self) => {
        return index === 0 || value.time !== self[index - 1].time;
      });
    if (allCandles.length > 0) {
      candleSeries.setData(allCandles);
    }
    if (allHistograms.length > 0) {
      lineSeries.setData(allHistograms);
    }

    const prevLastTime =
      infiniteData.pages.length > 1
        ? infiniteData.pages.at(-2)?.candle?.at(0)?.time // 이전 데이터 첫번째 시간 사용
        : allCandles.at(0)?.time;

    if (infiniteData.pages.length > 1) {
      chart.timeScale().setVisibleRange({
        from: prevLastTime,
        to: prevLastTime + INTERVAL_OPTION[chartInterval],
      });
    }

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
      if (!timeRange || isLoadingRef.current || isEndRef.current) return;

      const lastFetchedTime =
        infiniteData?.pages?.at(-1)?.candle?.[0]?.time || 0;

      if (Number(timeRange.from) <= lastFetchedTime) {
        isLoadingRef.current = true;
        await fetchNextPage();
        isLoadingRef.current = false;
      }
    });

    const observer = new ResizeObserver(() => {
      chart.applyOptions({
        width: chartRef.current?.clientWidth || 800,
      });
    });

    observer.observe(chartRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [infiniteData, fetchNextPage]);

  return (
    <div>
      <IntervalMenu
        changeInterval={changeInterval}
        chartInterval={chartInterval}
      />
      <div className='relative p-5 bg-white rounded-b border-t'>
        {hoverData && (
          <div className='absolute top-0 w-fit p-4 rounded-md z-30 flex text-sm gap-3 text-gray-600'>
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
        <div
          ref={chartRef}
          className='w-full min-h-1/2 flex justify-center bg-white'
        />
      </div>
    </div>
  );
}
