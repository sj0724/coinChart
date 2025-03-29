'use client';

import { cancelOrder } from '@/app/api/order/helper';
import { DbOrder } from '@/types/dbData';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  order: DbOrder;
}

export default function OrderItem({ order }: Props) {
  const router = useRouter();
  const handleClick = () => {
    toast.promise(cancelOrder(order.id), {
      loading: 'Loading...',
      success: '주문이 취소되었습니다.',
      error: '주문 취소중 에러가 발생했습니다.',
    });
    router.refresh();
  };

  return (
    <div
      className={`flex p-2 text-[10px] md:text-sm rounded shadow ${
        order.type === 'ASK'
          ? 'bg-red-100/50 hover:bg-red-100/90'
          : 'bg-green-100/50 hover:bg-green-100/90'
      }`}
    >
      <p className='w-1/3 font-semibold'>{order.symbol}</p>
      <p className='w-1/3 text-end'>{order.price}$</p>
      <div className='w-1/3 flex justify-end items-center gap-3'>
        <p className='text-end'>{order.amount}</p>
        {!order.succeed && (
          <X
            width={15}
            height={15}
            className='cursor-pointer'
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}
