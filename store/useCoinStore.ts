import { create } from 'zustand';

interface CountState {
  price: string;
  amountBid: string;
  amountAsk: string;
  setPrice: (newPrice: string) => void; // price를 올리기 위한 setter
  setAmountBid: (increment: string) => void; // amountBid를 올리기 위한 setter
  setAmountAsk: (increment: string) => void; // amountAsk를 올리기 위한 setter
  removeAll: () => void;
}

const useCoinStore = create<CountState>((set) => ({
  price: '',
  amountBid: '',
  amountAsk: '',
  setPrice: (newPrice) => set({ price: newPrice }), // price 설정
  setAmountBid: (increment) => set(() => ({ amountBid: increment })), // amountBid 증가
  setAmountAsk: (increment) => set(() => ({ amountAsk: increment })), // amountAsk 증가
  removeAll: () => set({ price: '', amountBid: '', amountAsk: '' }), // 모두 초기화
}));

export default useCoinStore;
