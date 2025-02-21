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
    };

    chart.subscribeCrosshairMove((param) => {
      const data = param.seriesData.get(candleSeries);
      if (data) {
        setHoverData(data as Candle);
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
