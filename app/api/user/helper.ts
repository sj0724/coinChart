'use server';

import { supabase } from '@/utils/supabase';
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

export const updateUserData = async (newAsset: number) => {
  const user = await getUserData();
  if (user) {
    await supabase
      .from('users')
      .update({ invest: user.invest! + newAsset })
      .eq('id', user.id);
  }
};
