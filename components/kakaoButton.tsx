'use client';

import { signInWithKakao } from '@/app/api/auth/helper';

export default function KakaoButton() {
  const handleKakaoLogin = async () => {
    signInWithKakao();
  };
  return (
    <button
      onClick={handleKakaoLogin}
      className='bg-yellow-400 px-4 py-2 rounded-md w-full font-bold hover:bg-yellow-400/50 active:bg-yellow-500/80'
    >
      카카오 로그인
    </button>
  );
}
