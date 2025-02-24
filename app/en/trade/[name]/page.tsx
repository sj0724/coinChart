import SymbolInfo from './_components/symbolInfo';
import OrderBookContainer from './_components/orderContainer';
import Chart from './_components/chart';
import TradingList from './_components/tradingList';
import SymbolList from './_components/symbolList';
import TradingBoard from './_components/tradingBoard';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const symbolName = (await params).name;
  return (
    <div className='flex w-screen gap-2 justify-center py-2'>
      <OrderBookContainer symbol={symbolName} />
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
