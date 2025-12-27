import { supabase } from '../../supabaseClient';

export const getTable = async (tableName: string) => {
  // Check for session, if none, wait a bit or listen for auth state change
  let { data: { session } } = await supabase.auth.getSession();

  if (!session) {
      // Wait for sign in event with timeout
      await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
              subscription.unsubscribe();
              reject(new Error('Authentication timeout: No session available'));
          }, 5000); // 5 second timeout

          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
              if (event === 'SIGNED_IN' && session) {
                  clearTimeout(timeout);
                  subscription.unsubscribe();
                  resolve();
              } else if (event === 'SIGNED_OUT') {
                  clearTimeout(timeout);
                  subscription.unsubscribe();
                  reject(new Error('Authentication failed: User signed out'));
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
