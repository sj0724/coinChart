'use server';

import { createClientForServer } from '@/utils/supabase/server';

export const getUserData = async () => {
  const supabase = await createClientForServer();

  const { data: user } = await supabase.auth.getUser();
  if (user && user.user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.user.id);
    if (data) {
      return data[0];
    }
  }
};
