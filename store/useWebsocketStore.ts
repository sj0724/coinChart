import { BASE_WS_URL } from '@/lib/constance';
import { SORT_OPTIONS } from '@/types/sort';
import { AggTrade, DepthUpdate, Ticker } from '@/types/streams';
import { create } from 'zustand';

interface WebSocketStore {
  sortBy: SORT_OPTIONS;
  symbol: string;
  miniTicker: Ticker[];
  depthUpdate: DepthUpdate | null;
  aggTrade: AggTrade[];
  setSortBy: (option: SORT_OPTIONS) => void;
  setSymbol: (symbol: string) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
  let socket: WebSocket | null = null;

  return {
    sortBy: 'priceDes',
    symbol: '',
    miniTicker: [],
    depthUpdate: null,
    aggTrade: [],
    setSortBy: (newSortBy: SORT_OPTIONS) => set({ sortBy: newSortBy }),
    setSymbol: (newSymbol: string) => {
      const currentSymbol = get().symbol;

      // 🔴 현재 심볼과 동일하면 새 WebSocket을 만들지 않음
      if (currentSymbol === newSymbol) return;

      set({ symbol: newSymbol });

      if (socket) {
        socket.close();
        socket = null;
      }

      if (!socket) {
        socket = new WebSocket(BASE_WS_URL);
        socket.onopen = () => {
          const smallSymbol = newSymbol.toLowerCase();
          const subscribeMessage = {
            method: 'SUBSCRIBE',
            params: [
              '!ticker@arr@3000ms',
              `${smallSymbol}@depth`,
              `${smallSymbol}@aggTrade`,
            ],
            id: 1,
          };
          if (socket) {
            socket.send(JSON.stringify(subscribeMessage));
          }
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (
            Array.isArray(data) &&
            data.length > 0 &&
            data[0].e === '24hrTicker'
          ) {
            const currentSortBy = get().sortBy;

            const sortedData = data
              .filter((symbol) => symbol.s.toLowerCase().endsWith('usdt'))
              .sort((a, b) => {
                if (currentSortBy === 'priceDes') {
                  // 가격 내림차순 정렬
                  return parseFloat(b.c) - parseFloat(a.c);
                } else if (currentSortBy === 'priceAsc') {
                  // 가격 오림차순 정렬
                  return parseFloat(a.c) - parseFloat(b.c);
                } else {
                  // 거래량 내림차순 정렬
                  return parseFloat(b.q) - parseFloat(a.q);
                }
              });
            set({ miniTicker: sortedData });
          } else if (data.e === 'depthUpdate') {
            set({ depthUpdate: data });
          } else if (data.e === 'aggTrade') {
            set((state) => ({
              aggTrade: [{ ...data }, ...state.aggTrade.slice(0, 29)],
            }));
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket 오류:', error);
        };

        socket.onclose = () => {
          console.warn('WebSocket 연결이 종료되었습니다.');
          socket = null;
        };
      }
    },
  };
});
