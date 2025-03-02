import { BASE_BINANCE_URL } from '@/lib/constance';

export const fetchChartData = async (
  chartInterval: string,
  symbol: string,
  limit: number,
  time?: string | null
) => {
  const apiUrl = new URL(`${BASE_BINANCE_URL}/klines`);
  apiUrl.searchParams.append('symbol', symbol);
  apiUrl.searchParams.append('interval', chartInterval);
  apiUrl.searchParams.append('limit', String(limit));

  if (time) {
    const endTime = Number(time) * 1000;
    apiUrl.searchParams.append('endTime', String(endTime));
  }
  const response = await fetch(apiUrl.toString());
  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newCandle = data.map((candle: any) => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newHistogram = data.map((histogram: any) => ({
    time: histogram[0] / 1000,
    value: parseFloat(histogram[5]),
  }));

  return { candle: newCandle, histogram: newHistogram };
};
