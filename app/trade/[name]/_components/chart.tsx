'use client';

import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

interface Props {
  symbol: string;
}

export default function Chart({ symbol }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

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

      const formattedData = result.map((candle: any) => ({
        time: candle[0] / 1000, // UNIX timestamp (초 단위)
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));

      candleSeries.setData(formattedData);
    };

    fetchCandles();

    return () => {
      chart.remove();
    };
  }, []);

  return <div ref={chartRef} className='border rounded-md p-5' />;
}
