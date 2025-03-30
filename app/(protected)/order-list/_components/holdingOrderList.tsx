'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import OrderItem from './orderItem';
import { DbOrder } from '@/types/dbData';
import { getHoldingOrder } from '@/app/api/order/helper';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import OrderSkeleton from '../../_components/skeleton/orderSkeleton';

interface Props {
  totalCount: number;
  data?: DbOrder[] | null;
}

export default function HoldingOrderList({ totalCount, data }: Props) {
  const [page, setPage] = useState(2);
  const [isPending, startTransition] = useTransition();
  const [isNext, setIsNext] = useState(true);
  const [orderList, setOrderList] = useState<DbOrder[]>([]);

  const loadMoreOrder = useCallback(async () => {
    startTransition(async () => {
      const result = await getHoldingOrder(page, 15);
      if (result && result.data) {
        setPage(page + 1);
        setOrderList((prev) => [...prev, ...result.data]);
      }
    });
  }, [page]);

  const obsRef = useInfiniteScroll({
    callback: () => loadMoreOrder(),
    isLoading: isPending,
    isNext,
  });

  useEffect(() => {
    if (totalCount === orderList.length) {
      setIsNext(false);
    }
  }, [orderList, totalCount]);

  useEffect(() => {
    if (data && data.length > 0) {
      setOrderList(data);
    } else {
      setOrderList([]);
      setIsNext(false);
    }
  }, [data]);

  if (!data || data.length === 0)
    return (
      <div className='flex flex-col bg-white p-2 gap-2 rounded w-full max-w-[400px] min-h-[500px] h-full'>
        <p className='font-bold text-lg p-2 border-b'>체결 대기</p>
        <div className='flex flex-col items-center justify-center rounded h-full bg-gray-100 font-semibold'>
          아직 등록된 주문이 없습니다.
        </div>
      </div>
    );

  return (
    <div className='flex flex-col bg-white p-2 gap-2 rounded w-full max-w-[400px] min-h-[500px] h-full'>
      <p className='font-bold text-lg p-2 border-b'>체결 대기</p>
      <ul className='flex flex-col gap-2 overflow-y-scroll'>
        {orderList.map((item) => (
          <li key={item.id}>
            <OrderItem order={item} />
          </li>
        ))}
        {isPending && <OrderSkeleton />}
        {isNext && <div ref={obsRef} />}
      </ul>
    </div>
  );
}
