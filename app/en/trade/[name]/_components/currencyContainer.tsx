import { CURRENCY_OPTIONS } from '@/lib/menu';

interface Props {
  currentCurrency: string;
  handleClick: (value: string) => void;
}

export default function CurrencyContainer({
  currentCurrency,
  handleClick,
}: Props) {
  return (
    <div className='max-w-full h-fit flex overflow-x-scroll gap-1'>
      {CURRENCY_OPTIONS.map((item, index) => (
        <div
          onClick={() => handleClick(item)}
          key={index}
          className={`${
            currentCurrency === item && 'border-b-2 border-blue-500 font-bold'
          } cursor-pointer px-2 py-1 flex items-center h-fit hover:font-bold text-xs`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
