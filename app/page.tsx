'use client';

import Button from '@/components/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isExisting, setIsExisting] = useState(false);
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!amount || Number(amount) <= 0) return; // 빈 값 또는 0 이하 방지
    localStorage.setItem('investor', amount);
    router.replace('/en/trade/BTCUSDT');
  };

  useEffect(() => {
    const existingUser = localStorage.getItem('investor');
    if (existingUser) {
      setIsExisting(true);
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='max-w-[400px] flex flex-col items-center justify-between w-full rounded-lg border bg-white p-6 shadow-md'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-2xl mb-4 text-gray-800'>
            가상 화폐 모의 투자
          </h1>
          <p className='text-sm text-gray-600 text-center mb-6'>
            내 돈으로 하기 무서운 예비 투자자들을 위한 모의투자! <br />
            원하는 자산으로 가상 투자를 시작해보세요.
          </p>
        </div>
        {isExisting ? (
          <Link
            href='/en/trade/BTCUSDT'
            className='bg-blue-500 font-bold text-white px-4 py-2 rounded-md w-full text-center shadow hover:bg-blue-600 transition'
          >
            투자 이어하기
          </Link>
        ) : (
          <form className='flex flex-col w-full gap-3' onSubmit={onSubmit}>
            <label htmlFor='amount' className='text-gray-700 text-sm mb-1'>
              투자 시작 금액 ($)
            </label>
            <div className='relative flex items-center'>
              <input
                id='amount'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300'
                min='1'
                placeholder='1000'
              />
              <span className='absolute right-3 text-gray-500'>$</span>
            </div>
            <Button type='submit' color='green'>
              투자 시작하기
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
