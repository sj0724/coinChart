import { create } from 'zustand';

export type OrderType = 'ask' | 'bid';

export type Order = {
  price: number;
  amount: number;
};

interface State {
  ask: Order;
  bid: Order;
  setOrder: (type: OrderType, order: Order) => void;
}

const useOrderStore = create<State>((set) => ({
  ask: { price: 0, amount: 0 },
  bid: { price: 0, amount: 0 },
  setOrder: (type, order) => {
    if (type === 'ask') {
      set({ ask: order });
    } else if (type === 'bid') {
      set({ bid: order });
    }
  },
}));

export default useOrderStore;
