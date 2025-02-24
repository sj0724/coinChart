import { create } from 'zustand';

interface State {
  status: boolean;
  setStatus: (newPrice: boolean) => void;
}

const useCoinStatusStore = create<State>((set) => ({
  status: true,
  setStatus: (newStatus) => set({ status: newStatus }),
}));

export default useCoinStatusStore;
