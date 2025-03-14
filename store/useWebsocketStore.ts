import { BASE_WS_URL } from '@/lib/constance';
import { AggTrade, DepthUpdate, Miniticker } from '@/types/streams';
import { mergeDepthData } from '@/utils/mergeDepthData';
import { create } from 'zustand';

export type DepthDateType = {
  asks: string[][] | [];
  bids: string[][] | [];
};

interface WebSocketStore {
  symbol: string;
  miniTicker: Miniticker[];
  depthUpdate: DepthDateType;
  aggTrade: AggTrade[];
  setDepthUpdate: (data: DepthDateType) => void;
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
        tickerMap.set(symbol.s, symbol);
      });

      set({ miniTicker: Array.from(tickerMap.values()) });
    } else if (data.e === 'depthUpdate') {
      const depthData: DepthUpdate = data;
      const currentData = get().depthUpdate;
      if (!currentData.asks || !currentData.bids) return; // 초기 데이터 설정 후, 웹소켓 데이터 추가
      const askList = mergeDepthData(
        depthData.a || [],
        currentData.asks,
        false
      ).reverse(); // 가격 낮은 순
      const bidList = mergeDepthData(depthData.b || [], currentData.bids, true); // 가격 높은 순
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
    if (!socket) {
      socket = new WebSocket(BASE_WS_URL);
    }
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
      const currentSymbol = get().symbol;
      if (currentSymbol && socket) {
        socket.onopen = () => {
          const subscribeMessage = {
            method: 'UNSUBSCRIBE',
            params: [
              '!miniTicker@arr@3000ms',
              `${currentSymbol.toLowerCase()}@depth`,
              `${currentSymbol.toLowerCase()}@aggTrade`,
            ],
            id: 1,
          };
          socket?.send(JSON.stringify(subscribeMessage));
        };
      }
      if (currentSymbol !== newSymbol) {
        set({ symbol: newSymbol });
        get().connectWebSocket();
      }
    },
    setDepthUpdate: (data: DepthDateType) => {
      set({ depthUpdate: data });
    },
    connectWebSocket,
    disconnectWebSocket,
  };
});
