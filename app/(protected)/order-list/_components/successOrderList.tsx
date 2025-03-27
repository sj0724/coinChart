import OrderItem from './orderItem';
import { DbOrder } from '@/types/dbData';

export default function SuccessOrderList({
  data,
}: {
  data?: DbOrder[] | null;
}) {
  if (!data || data.length === 0)
    return (
      <div className='flex flex-col bg-white p-2 gap-2 rounded w-full max-w-[400px] min-h-[500px] h-full'>
        <p className='font-bold text-lg p-2 border-b'>체결 완료</p>
        <div className='flex flex-col items-center justify-center m-3 rounded h-full bg-gray-100 font-semibold'>
          아직 체결된 주문이 없습니다.
        </div>
      </div>
    );

  return (
    <div className='flex flex-col bg-white p-2 gap-2 rounded w-full max-w-[400px] min-h-[500px] h-full'>
      <p className='font-bold text-lg p-2 border-b'>체결 완료</p>
      <ul className='flex flex-col gap-2'>
        {data.map((item) => (
          <li key={item.id}>
            <OrderItem order={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
