import { getSuccessOrder } from '@/app/api/order/helper';
import OrderItem from './orderItem';

export default async function SuccessOrderList() {
  const data = await getSuccessOrder();
  return (
    <div className='flex flex-col bg-white p-2 gap-2 rounded w-full max-w-[400px] min-h-[500px] h-full'>
      <p className='font-bold text-lg p-2'>체결 완료</p>
      <ul className='flex flex-col gap-1'>
        {data?.map((item) => (
          <li key={item.id}>
            <OrderItem order={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
