'use client';

import { cancelOrder } from '@/app/api/order/helper';
import { DbOrder } from '@/types/dbData';
import { X } from 'lucide-react';

interface Props {
  order: DbOrder;
}

export default function OrderItem({ order }: Props) {
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
            onClick={() => cancelOrder(order.id)}
          />
        )}
      </div>
    </div>
  );
}
