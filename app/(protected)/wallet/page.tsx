'use client';

import { getWallet } from '@/app/api/wallet/helper';
import { DbWallet } from '@/types/dbData';
import { useEffect, useState } from 'react';

export default function Page() {
  const [walletData, setWalletData] = useState<DbWallet[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getWallet();
      if (result) {
        setWalletData(result);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      지갑
      <ul className='flex flex-col'>
        {walletData.map((item) => (
          <li key={item.id} className='flex gap-2'>
            <p>{item.symbol}</p>
            <p>{item.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
