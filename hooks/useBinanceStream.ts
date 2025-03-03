import { BASE_WS_URL } from '@/lib/constance';
import { AggTrade, DepthUpdate, MiniTicker } from '@/types/streams';
import { useEffect, useState } from 'react';

export const useBinanceWebSocket = (symbol: string) => {
  const [miniTicker, setMiniTicker] = useState<MiniTicker[]>([]);
  const [depthUpdate, setDepthUpdate] = useState<DepthUpdate | null>(null);
  const [aggTradeList, setAggTradeList] = useState<AggTrade[]>([]);

  useEffect(() => {
    const socket = new WebSocket(BASE_WS_URL);

    socket.onopen = () => {
      const smallSymbol = symbol.toLowerCase();
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: [
          '!miniTicker@arr',
          `${smallSymbol}@depth`,
          `${smallSymbol}@aggTrade`,
        ],
        id: 1,
      };

      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].e === '24hrMiniTicker'
      ) {
        setMiniTicker(data as MiniTicker[]);
      } else if (data.e === 'depthUpdate') {
        setDepthUpdate(data as DepthUpdate);
      } else if (data.e === 'aggTrade') {
        setAggTradeList((prev) => [data, ...prev.slice(0, 29)]);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return { miniTicker, depthUpdate, aggTradeList };
};
