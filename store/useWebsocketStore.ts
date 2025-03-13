import { BASE_WS_URL } from '@/lib/constance';
import { AggTrade, DepthUpdate, Miniticker } from '@/types/streams';
import { create } from 'zustand';

type DepthDateType = {
  asks: string[][] | [];
  bids: string[][] | [];
};

interface WebSocketStore {
  symbol: string;
  miniTicker: Miniticker[];
  depthUpdate: DepthDateType;
  aggTrade: AggTrade[];
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
      const existingMiniTicker = get().miniTicker;
      const tickerMap = new Map(
        existingMiniTicker.map((item) => [item.s, item])
      );

      data.forEach((symbol) => {
        if (symbol.s.toLowerCase().endsWith('usdt')) {
          tickerMap.set(symbol.s, symbol);
        }
      });

      set({ miniTicker: Array.from(tickerMap.values()) });
    } else if (data.e === 'depthUpdate') {
      const depthData: DepthUpdate = data;
      const askList = Array.isArray(depthData?.a)
        ? [...depthData.a]
            .filter((ask) => ask[1] !== '0.00000000')
            .slice(0, 19)
            .reverse()
        : [];
      const bidList = Array.isArray(depthData?.b)
        ? [...depthData?.b]
            .filter((bid) => bid[1] !== '0.00000000')
            .slice(0, 19)
        : [];
      set({ depthUpdate: { asks: askList, bids: bidList } });
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
    symbol: '',
    miniTicker: [],
    depthUpdate: { asks: [], bids: [] },
    aggTrade: [],
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
