// utlity sheet for supabase functions
// https://supabase.com/dashboard/project/zoegnhftibdncrivxekx/database/functions

import { checkIfUuid } from './stringUtils';
import { supabase } from '../../supabaseClient';

const waitForSession = async () => {
  // First check if credentials are set in settings
  const email = localStorage.getItem('snapfab-email');
  const password = localStorage.getItem('snapfab-password');
  
  if (!email || !password) {
    throw new Error('Authentication credentials not configured. Please set your email and password in Settings.');
  }

  // Check for session, if none, wait a bit or listen for auth state change
  let { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Wait for sign in event with timeout
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        subscription.unsubscribe();
        reject(new Error('Authentication timeout: No session available'));
      }, 2000); // 2 second timeout

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
};


export const listTables = async (orgId: string) => {
  await waitForSession();

  const isUuid = checkIfUuid(orgId);

  const { data: rpcData, error } = await supabase.rpc('list_app_tables', {
    [isUuid ? '_org_id' : '_org_name']: orgId,
  });

  if (error) throw error;

  return rpcData;
};


export const getTable = async (tableId: string) => {
  await waitForSession();

  const isUuid = checkIfUuid(tableId);

  const { data: rpcData, error } = await supabase.rpc('get_app_table', {
    [isUuid ? '_table_id' : '_table_name']: tableId,
  });

  if (error) {
    if (error.message === 'Table not found') return null;
    throw error;
  }

  return rpcData;
};


export const listOrgs = async () => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('list_orgs');

  if (error) throw error;

  return rpcData;
};


export const createTable = async (name: string, description: string, orgId: string) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('create_app_table', {
    _name: name,
    _description: description,
    _org_id: orgId,
  });

  if (error) throw error;

  return rpcData;
};


export const deleteTable = async (tableId: string) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('delete_app_table', {
    _table_id: tableId,
  });

  if (error) throw error;

  return rpcData;
};