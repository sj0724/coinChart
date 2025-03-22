'use client';

import { signOut } from '@/app/api/auth/helper';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const disconnectWebSocket = useWebSocketStore(
    (state) => state.disconnectWebSocket
  );

  const handleClick = () => {
    signOut();
    disconnectWebSocket();
    router.replace('/');
  };

  return (
    <button
      onClick={handleClick}
      className='bg-red-400 md:px-4 px-2 md:py-2 py-1 rounded-md text-xs md:text-lg font-bold hover:bg-red-400/50 active:bg-red-500/80'
    >
      로그아웃
    </button>
  );
}
