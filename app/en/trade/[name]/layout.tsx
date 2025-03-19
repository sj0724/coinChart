'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const [startAsset, setStartAsset] = useState(0);
  const [myasset, setMyAsset] = useState(0);

  const changePercent = myasset
    ? ((myasset - startAsset) / startAsset) * 100
    : 0;

  useEffect(() => {
    const data = localStorage.getItem('investor');
    if (data) {
      const parseData = JSON.parse(data);
      setMyAsset(parseData.current);
      setStartAsset(parseData.start);
    }
  }, []);

  return (
    <>
      <nav className='sticky top-0 left-0 w-full flex justify-center bg-white z-50'>
        <div className='flex items-center w-full h-16 px-4 gap-3 justify-end shadow rounded border'>
          <p className='text-lg font-semibold flex gap-1'>
            수익률 :
            <span
              className={`text-lg font-semibold ${
                changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {changePercent.toFixed(2)}%
            </span>
          </p>
          <span className='text-lg font-semibold'>내 자산: ${myasset}</span>
        </div>
      </nav>
      {children}
    </>
  );
}
