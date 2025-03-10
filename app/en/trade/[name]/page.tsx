'use client';

import SymbolInfo from './_components/symbolInfo';
import OrderBookContainer from './_components/orderContainer';
import Chart from './_components/chart';
import TradingList from './_components/tradingList';
import SymbolList from './_components/symbolList';
import TradingBoard from './_components/tradingBoard';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { use, useEffect } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: symbolName } = use(params);
  const setSymbol = useWebSocketStore((state) => state.setSymbol);

  useEffect(() => {
    setSymbol(symbolName);
  }, [symbolName]);

  return (
    <div className='flex w-screen gap-2 justify-center py-2'>
      <OrderBookContainer />
      <div className='flex flex-col gap-2'>
        <SymbolInfo symbol={symbolName} />
        <Chart symbol={symbolName} />
        <TradingBoard />
      </div>
      <div className='flex flex-col gap-2'>
        <SymbolList />
        <TradingList symbol={symbolName} />
      </div>
    </div>
  );
}
