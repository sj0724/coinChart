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
      className='bg-red-400 px-4 py-2 rounded-md font-bold hover:bg-red-400/50 active:bg-red-500/80'
    >
      로그아웃
    </button>
  );
}
