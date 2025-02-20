import { SymbolData } from '@/types/binance';
import Link from 'next/link';

interface Props {
  symbol: SymbolData;
}

export default async function SymbolListItem({ symbol }: Props) {
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    // 1보다 작은 경우, 소수점 4자리까지 표시
    if (Math.abs(num) < 1) {
      return num;
    }
    // 1보다 큰 경우에는 천 단위마다 쉼표를 추가
    const formattedNumber =
      num % 1 === 0 ? num : Number(num.toFixed(2).replace(/\.00$/, '')); // 소수점 2자리 표시, 00일경우 00제거
    return new Intl.NumberFormat().format(formattedNumber);
  };

  return (
    <Link href={`/trade/${symbol.symbol}`}>
      <div className='py-2 px-3 flex justify-between hover:bg-gray-100 text-sm'>
        <p>{symbol.symbol}</p>
        <div className='flex gap-5 text-center items-center'>
          <p>{formatNumber(symbol.lastPrice)}</p>
          <p
            className={`${
              Math.abs(parseFloat(symbol.priceChangePercent)) < 1
                ? 'text-red-600'
                : 'text-green-500'
            } text-xs`}
          >
            {Math.abs(parseFloat(symbol.priceChangePercent)) < 1 ? '-' : '+'}
            {symbol.priceChangePercent.split('-').length > 1 // -가 있는 숫자인 경우, - 제거
              ? symbol.priceChangePercent.split('-')[1]
              : symbol.priceChangePercent}
            %
          </p>
        </div>
      </div>
    </Link>
  );
}
