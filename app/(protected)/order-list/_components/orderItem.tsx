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
      className={`flex p-2 text-[10px] md:text-sm font-semibold rounded ${
        order.type === 'ASK' ? 'bg-red-100' : 'bg-green-100'
      }`}
    >
      <p className='w-1/3'>{order.symbol}</p>
      <p className='w-1/3'>{order.price}$</p>
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
