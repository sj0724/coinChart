'use client';

import { useEffect, useState } from 'react';
import SymbolSearchBar from './symbolSearchBar';
import SymbolSortDropdown from '@/app/en/trade/[name]/_components/symbolSortDropdown';
import { SORT_MENU } from '@/lib/menu';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import SymbolListItem from './symbolListItem';
import { SORT_OPTIONS } from '@/types/sort';
import CurrencyContainer from './currencyContainer';
import { fetchSymbolList } from '@/app/api/totalList/helper';
import { convertToMiniTicker } from '@/utils/convertToMiniTicker';
import { DEFAULT_CURRENCY } from '@/lib/constance';

export default function SymbolList() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SORT_OPTIONS>('priceDes');
  const miniTicker = useWebSocketStore((state) => state.miniTicker);
  const setMiniTicker = useWebSocketStore((state) => state.setminiTicker);

  const sortTickerList = Array.from(miniTicker.values())
    .sort((a, b) => {
      if (sortBy === 'priceDes') return parseFloat(b.c) - parseFloat(a.c);
      if (sortBy === 'priceAsc') return parseFloat(a.c) - parseFloat(b.c);
      return parseFloat(b.q) - parseFloat(a.q);
    })
    .filter((item) => item.s.endsWith(currency));

  const changeCurrency = (value: string) => {
    setCurrency(value);
  };

  const filteredList = sortTickerList.filter((item) =>
    item.s.toLowerCase().includes(keyword.toLowerCase())
  );

  const changeKeyword = (value: string) => {
    setKeyword(value);
  };

  const changeSortBy = (option: SORT_OPTIONS) => {
    setSortBy(option);
  };

  useEffect(() => {
    const getSymbolList = async () => {
      const result = await fetchSymbolList();
      if (result) {
        const convertData = convertToMiniTicker(result);
        setMiniTicker(convertData);
      }
    };
    getSymbolList();
  }, []);

  return (
    <div className='relative rounded bg-white h-1/2 overflow-y-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full pt-3 px-3 gap-2 text-sm'>
        <SymbolSearchBar onChange={changeKeyword} />
        <div className='flex flex-col items-end'>
          <CurrencyContainer
            currentCurrency={currency}
            handleClick={changeCurrency}
          />
          <SymbolSortDropdown
            list={SORT_MENU}
            sortBy={sortBy}
            setSortBy={changeSortBy}
          />
        </div>
      </div>
      <ul className='flex flex-col'>
        {filteredList.map((item) => (
          <li key={item.s}>
            <SymbolListItem symbol={item} currency={currency} />
          </li>
        ))}
      </ul>
    </div>
  );
}
