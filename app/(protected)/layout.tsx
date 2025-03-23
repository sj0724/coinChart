'use client';

import { getUserData } from '@/app/api/user/helper';
import LogoutButton from '@/components/logoutButton';
import { BitcoinIcon, ListOrderedIcon, Wallet } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const [userInvest, setUserInvest] = useState(0);
  const [changePercent, setChangePercent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserData();

      if (user) {
        setUserInvest(user.invest || 0);
        const percent =
          user.invest && user.start_invest
            ? ((user.invest - user.start_invest) / user.start_invest) * 100
            : 0;
        setChangePercent(percent);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className='sticky top-0 right-0 w-full flex justify-center bg-white z-50'>
        <div className='flex items-center w-full h-16 px-4 justify-between shadow rounded border'>
          <div className='flex items-center gap-3 text-sm md:text-lg font-semibold'>
            <Link href='/trade/BTCUSDT'>
              <span className='rounded-full bg-yellow-400 w-10 h-10 items-center flex justify-center'>
                <BitcoinIcon width={25} height={25} />
              </span>
            </Link>

            <p className='flex gap-1'>
              수익률 :
              <span
                className={`${
                  changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {changePercent.toFixed(2)}%
              </span>
            </p>
            <span>내 자산: ${userInvest}</span>
          </div>
          <div className='flex gap-6'>
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
