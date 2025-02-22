import { Time } from 'lightweight-charts';

export type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Volume = {
  time: Time;
  value: number;
};
