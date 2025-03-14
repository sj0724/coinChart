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
    <div className='max-w-full h-12 flex overflow-x-scroll gap-1'>
      {CURRENCY_OPTIONS.map((item, index) => (
        <div
          onClick={() => handleClick(item)}
          key={index}
          className={`${
            currentCurrency === item && 'bg-gray-300 font-bold'
          } cursor-pointer p-2 rounded flex items-center h-fit hover:font-bold`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
