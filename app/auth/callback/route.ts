import { NextRequest, NextResponse } from 'next/server';

import { createClientForServer } from '@/utils/supabase/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = '/en/trade/BTCUSDT'; // 원하는 경로로 설정

  if (code) {
    const supabaseServer = await createClientForServer();
    const { data, error } = await supabaseServer.auth.exchangeCodeForSession(
      code
    );
    const user = data.user;

    if (user) {
      const existingUser = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);
      if (existingUser.data && !existingUser.data[0]) {
        const { error } = await supabase.from('users').insert([
          {
            id: user.id,
            name: user.user_metadata.full_name || '카카오 유저',
            email: user.email,
            invest: 1000000,
            start_invest: 1000000,
          },
        ]);
        if (error) {
          console.error('유저 데이터 추가 실패:', error.message);
        }
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
