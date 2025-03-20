import { create } from 'zustand';
import { useWebSocketStore } from './useWebsocketStore';
import { orderCalculator } from '@/utils/orderCalculator';

export type OrderType = 'ask' | 'bid';

export type Order = {
  price: number;
  amount: number;
};

interface State {
  ask: Order;
  bid: Order;
  setOrder: (type: OrderType, order: Order) => void;
  checkOrderMatch: () => void;
}

const useOrderStore = create<State>((set, get) => ({
  ask: { price: 0, amount: 0 },
  bid: { price: 0, amount: 0 },
  setOrder: (type, order) => {
    if (type === 'ask') {
      set({ ask: order });
    } else {
      set({ bid: order });
    }
  },
  checkOrderMatch: () => {
    const { ask, bid } = get();
    const { depthUpdate } = useWebSocketStore.getState();
    const { symbol } = useWebSocketStore.getState();
    if (!depthUpdate) return;

    const matchedAsk = depthUpdate.asks.find(
      (order) => Number(order[0]) === ask.price
    );
    const matchedBid = depthUpdate.bids.find(
      (order) => Number(order[0]) === bid.price
    );

    if (matchedAsk) {
      const result = {
        price: ask.price,
        amount:
          ask.amount >= Number(matchedAsk[1])
            ? Number(matchedAsk[1])
            : Number(matchedAsk[1]) - ask.amount,
      };
      orderCalculator('ask', result, symbol);
      console.log('매도 주문 체결됨:', result);
      set({ ask: { price: 0, amount: 0 } });
    }

    if (matchedBid) {
      console.log('매수 주문 체결됨:', matchedBid);
      set({ bid: { price: 0, amount: 0 } });
    }
  },
}));

// WebSocket Store 구독하여 depthUpdate 변경 감지
useWebSocketStore.subscribe(() => {
  useOrderStore.getState().checkOrderMatch();
});

export default useOrderStore;
