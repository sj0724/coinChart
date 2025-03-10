import { BASE_WS_URL } from '@/lib/constance';
import { SORT_OPTIONS } from '@/types/sort';
import { AggTrade, DepthUpdate, Miniticker } from '@/types/streams';
import { create } from 'zustand';

interface WebSocketStore {
  sortBy: SORT_OPTIONS;
  symbol: string;
  miniTicker: Miniticker[];
  depthUpdate: DepthUpdate | null;
  aggTrade: AggTrade[];
  setSortBy: (option: SORT_OPTIONS) => void;
  setSymbol: (symbol: string) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
  let socket: WebSocket | null = null;

  const handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      data[0].e === '24hrMiniTicker'
    ) {
      const currentSortBy = get().sortBy;
      const existingMiniTicker = get().miniTicker;
      const tickerMap = new Map(
        existingMiniTicker.map((item) => [item.s, item])
      );

      data.forEach((symbol) => {
        if (symbol.s.toLowerCase().endsWith('usdt')) {
          tickerMap.set(symbol.s, symbol);
        }
      });

      const updatedMiniTicker = Array.from(tickerMap.values()).sort((a, b) => {
        if (currentSortBy === 'priceDes')
          return parseFloat(b.c) - parseFloat(a.c);
        if (currentSortBy === 'priceAsc')
          return parseFloat(a.c) - parseFloat(b.c);
        return parseFloat(b.q) - parseFloat(a.q);
      });
      set({ miniTicker: updatedMiniTicker });
    } else if (data.e === 'depthUpdate') {
      set({ depthUpdate: data });
    } else if (data.e === 'aggTrade') {
      set((state) => ({
        aggTrade: [{ ...data }, ...state.aggTrade.slice(0, 29)],
      }));
    }
  };

  const connectWebSocket = () => {
    const symbol = get().symbol;
    if (!symbol) return;
    if (socket) socket.close();

    socket = new WebSocket(BASE_WS_URL);
    socket.onopen = () => {
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: [
          '!miniTicker@arr@3000ms',
          `${symbol.toLowerCase()}@depth`,
          `${symbol.toLowerCase()}@aggTrade`,
        ],
        id: 1,
      };
      socket?.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = handleWebSocketMessage;
    socket.onerror = (error) => console.error('WebSocket 오류:', error);
    socket.onclose = () => {
      console.warn('WebSocket 연결이 종료되었습니다.');
      socket = null;
    };
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  return {
    sortBy: 'priceDes',
    symbol: '',
    miniTicker: [],
    depthUpdate: null,
    aggTrade: [],
    setSortBy: (newSortBy: SORT_OPTIONS) => set({ sortBy: newSortBy }),
    setSymbol: (newSymbol: string) => {
      if (get().symbol !== newSymbol) {
        set({ symbol: newSymbol });
        get().connectWebSocket();
      }
    },
    connectWebSocket,
    disconnectWebSocket,
  };
});
