'use client';

import LogoutButton from '@/components/logoutButton';
import { ListOrderedIcon, Menu, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='gap-3 hidden md:flex'>
        <Link href='/order-list'>
          <ListOrderedIcon width={25} height={25} />
        </Link>
        <Link href='/wallet'>
          <Wallet width={25} height={25} />
        </Link>
        <LogoutButton type='icon' />
      </div>
      <div className='md:hidden'>
        <Menu
          width={25}
          height={25}
          className='cursor-pointer'
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <div className='absolute left-0 top-full w-screen flex flex-col items-center bg-white p-3 shadow-lg'>
            <div className='h-10 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 w-full font-semibold rounded-lg'>
              <Link href='/order-list' onClick={() => setIsOpen(false)}>
                거래 내역
              </Link>
            </div>
            <div className='h-10 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 w-full font-semibold rounded-lg'>
              <Link href='/wallet' onClick={() => setIsOpen(false)}>
                지갑
              </Link>
            </div>
            <div className='h-10 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 w-full font-semibold rounded-lg'>
              <LogoutButton type='button' />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
