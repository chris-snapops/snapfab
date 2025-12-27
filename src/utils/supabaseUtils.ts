import { supabase } from '../../supabaseClient';

export const getTable = async (tableName: string) => {
  // Check for session, if none, wait a bit or listen for auth state change
  let { data: { session } } = await supabase.auth.getSession();

  if (!session) {
      // Wait for sign in event
      await new Promise<void>((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
              if (event === 'SIGNED_IN' || session) {
                  subscription.unsubscribe();
                  resolve();
              }
          });
      });
  }

  const { data: rpcData, error } = await supabase.rpc('get_table', { 
    table_name: tableName,
  });

  if (error) throw error;

  return rpcData;
};
