'use client';

import { getUserData } from '@/app/api/user/helper';
import LogoutButton from '@/components/logoutButton';
import useOrderStore from '@/store/useOrderStore';
import { BitcoinIcon, ListOrderedIcon, Wallet } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import { getOrder } from '../api/order/helper';
import { useQuery } from '@tanstack/react-query';

export default function Layout({ children }: { children: ReactNode }) {
  const setOrder = useOrderStore((state) => state.setOrder);

  const { data: userData } = useQuery({
    // 유저 데이터 캐싱
    queryKey: ['userData'],
    queryFn: () => getUserData(),
    staleTime: 1000 * 5, // 5초 동안은 캐싱된 데이터 사용, 최신 데이터를 위한 짧은 유효 시간
  });

  const percent =
    userData?.invest && userData?.start_invest
      ? ((userData.invest - userData.start_invest) / userData.start_invest) *
        100
      : 0;

  useEffect(() => {
    const fetchUserOrder = async () => {
      // 실시간 데이터 비교를 위한 db 주문 데이터 패칭
      const result = await getOrder();
      if (result) {
        const askList = result.filter(
          (item) => item.type === 'ASK' && !item.succeed
        );
        const bidList = result.filter(
          (item) => item.type === 'BID' && !item.succeed
        );
        setOrder('ASK', askList);
        setOrder('BID', bidList);
      }
    };
    fetchUserOrder();
  }, []);

  return (
    <>
      <nav className='sticky top-0 right-0 w-full flex justify-center bg-white z-50'>
        <div className='flex items-center w-full h-16 px-4 justify-between shadow rounded border'>
          <div className='flex items-center gap-3 text-xs md:text-lg font-semibold'>
            <Link href='/trade/BTCUSDT'>
              <span className='rounded-full bg-yellow-400 md:w-10 w-7 md:h-10 h-7 items-center flex justify-center'>
                <BitcoinIcon width={25} height={25} />
              </span>
            </Link>

            <p className='flex gap-1'>
              수익률 :
              <span
                className={`${
                  percent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {percent.toFixed(2)}%
              </span>
            </p>
            <span>내 자산: ${userData?.invest}</span>
          </div>
          <div className='flex gap-3 md:gap-6'>
            <Link href='/order-list'>
              <ListOrderedIcon width={25} height={25} />
            </Link>
            <Link href='/wallet'>
              <Wallet width={25} height={25} />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
