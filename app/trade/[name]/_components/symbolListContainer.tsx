import { SymbolData } from '@/types/binance';
import SymbolList from './symbolList';

export default async function SymbolListContainer() {
  const sortBy = 'price';
  const currency = 'USDT';

  const list = await fetch(
    `http://localhost:3000/api/totalList?sortBy=${sortBy}&currency=${currency}`
  );
  const result: SymbolData[] = await list.json();

  return (
    <>
      <SymbolList data={result} />
    </>
  );
}
