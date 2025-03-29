'use client';

import { signOut } from '@/app/api/auth/helper';
import { useWebSocketStore } from '@/store/useWebsocketStore';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  type: 'button' | 'icon';
}

export default function LogoutButton({ type }: Props) {
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
    <button onClick={handleClick}>
      {type === 'button' ? '로그아웃' : <LogOutIcon width={25} height={25} />}
    </button>
  );
}
