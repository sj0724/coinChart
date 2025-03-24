import { create } from 'zustand';
import { useWebSocketStore } from './useWebsocketStore';
import { DbOrder } from '@/types/dbData';
import { TradeType } from '@/app/(protected)/trade/[name]/_components/tradingBoard';
import { succeedOrder } from '@/app/api/order/helper';
import { updateWallet } from '@/app/api/wallet/helper';

interface State {
  ask: DbOrder[];
  bid: DbOrder[];
  setOrder: (type: TradeType, order: DbOrder[]) => void;
  checkOrderMatch: () => void;
}

const useOrderStore = create<State>((set, get) => ({
  ask: [],
  bid: [],
  setOrder: (type, order) => {
    const { ask, bid } = get();
    if (type === 'ASK') {
      if (ask.length > 0) {
        set({ ask: [...ask, ...order] });
      } else {
        set({ ask: order });
      }
    } else {
      if (bid.length > 0) {
        set({ bid: [...bid, ...order] });
      } else {
        set({ bid: order });
      }
    }
  },
  checkOrderMatch: async () => {
    const { ask, bid } = get();
    const depthUpdate = useWebSocketStore.getState().depthUpdate;
    if (!depthUpdate) return;

    const completedOrderList: DbOrder[] = [];

    const updatedAsk: DbOrder[] = ask.filter((order) => {
      const matchedAsk = depthUpdate.asks.find(
        (depth) => Number(depth[0]) === order.price
      );
      if (matchedAsk) {
        console.log('매도 주문 체결됨:', {
          price: order.price,
          amount: Math.min(order.amount, Number(matchedAsk[1])),
        });
        const completedAsk = {
          ...order,
          amount: Math.min(order.amount, Number(matchedAsk[1])),
        };
        completedOrderList.push(completedAsk);
        return false;
      }
      return true;
    });

    const updatedBid: DbOrder[] = bid.filter((order) => {
      const matchedBid = depthUpdate.bids.find(
        (depth) => Number(depth[0]) === order.price
      );
      if (matchedBid) {
        console.log('매수 주문 체결됨:', {
          price: order.price,
          amount: Math.min(order.amount, Number(matchedBid[1])),
        });
        const completedBid = {
          ...order,
          amount: Math.min(order.amount, Number(matchedBid[1])),
        };
        completedOrderList.push(completedBid);
        return false;
      }
      return true;
    });

    set({ ask: updatedAsk, bid: updatedBid });

    if (completedOrderList.length > 0) {
      await Promise.all(
        completedOrderList.map((item) => {
          updateWallet(item);
          succeedOrder(item.id);
        })
      );
    }
  },
}));

// WebSocket Store 구독하여 depthUpdate 변경 감지
useWebSocketStore.subscribe(() => {
  useOrderStore.getState().checkOrderMatch();
});

export default useOrderStore;
