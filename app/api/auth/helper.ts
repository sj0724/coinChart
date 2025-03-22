'use server';

import { createClientForServer } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClientForServer();
  const auth_callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });
  if (error) {
    console.log(error);
  }

  redirect(data.url as string);
};

const signOut = async () => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

const signInWithKakao = signInWith('kakao');

export { signInWithKakao, signOut };
