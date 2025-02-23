import { BASE_URL } from '@/lib/constance';

export const fetchChartData = async (
  chartInterval: string,
  symbol: string,
  limit: number,
  time?: string | null
) => {
  let arrData;
  if (time) {
    const endTime = Number(time) * 1000;
    const data = await fetch(
      `${BASE_URL}/chart?name=${symbol}&endTime=${endTime}&interval=${chartInterval}&limit=${limit}`
    );
    const result = await data.json();
    arrData = result;
  } else {
    const data = await fetch(
      `${BASE_URL}/chart?name=${symbol}&interval=${chartInterval}&limit=${limit}`
    );
    const result = await data.json();
    arrData = result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newCandle = arrData.map((candle: any) => ({
    time: candle[0] / 1000,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newHistogram = arrData.map((histogram: any) => ({
    time: histogram[0] / 1000,
    value: parseFloat(histogram[5]),
  }));

  return { candle: newCandle, histogram: newHistogram };
};
