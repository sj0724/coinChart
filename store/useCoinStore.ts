import { create } from 'zustand';

interface CountState {
  price: number;
  amountBid: number;
  amountAsk: number;
  setPrice: (newPrice: number) => void; // price를 올리기 위한 setter
  setAmountBid: (increment: number) => void; // amountBid를 올리기 위한 setter
  setAmountAsk: (increment: number) => void; // amountAsk를 올리기 위한 setter
  removeAll: () => void;
}

const useCoinStore = create<CountState>((set) => ({
  price: 0,
  amountBid: 0,
  amountAsk: 0,
  setPrice: (newPrice) => set({ price: newPrice }), // price 설정
  setAmountBid: (increment) => set(() => ({ amountBid: increment })), // amountBid 증가
  setAmountAsk: (increment) => set(() => ({ amountAsk: increment })), // amountAsk 증가
  removeAll: () => set({ price: 0, amountBid: 0, amountAsk: 0 }), // 모두 초기화
}));

export default useCoinStore;
