// utlity sheet for supabase functions
// https://supabase.com/dashboard/project/zoegnhftibdncrivxekx/database/functions

import { checkIfUuid } from './stringUtils';
import { supabase } from '../../supabaseClient';



/* - - - - - - - - Authentication - - - - - - - - - *
* Wait for session
*/
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


/* - - - - - - - - Organization RPCs - - - - - - - - - *
* List
* List members 
*/

export const listOrgs = async () => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('list_orgs');
  console.log(JSON.stringify(rpcData, null, 2));

  if (error) throw error;
  return rpcData;
};

export const listOrgMembers = async () => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('list_org_members');

  if (error) throw error;
  return rpcData;
};


/* - - - - - - - - - - Table RPCs - - - - - - - - - - *
* Create Table
* List Tables
* Get Table
* Update Table
* Archive Table 
*/

type TableData = {
  _name: string;
  _description: string;
  _archived: boolean;
}

export const createTable = async (orgId: string, tableData: TableData) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('create_app_table', {
    _org_id: orgId,
    _name: tableData._name,
    _description: tableData._description,
  });

  if (error) throw error;
  return rpcData;
};


export const listTables = async (orgId: string | null, hideArchived = true) => {
  if (!orgId) return;
  await waitForSession();

  const isUuid = checkIfUuid(orgId);

  const { data: rpcData, error } = await supabase.rpc('list_app_tables', {
    [isUuid ? '_org_id' : '_org_name']: orgId,
  });

  if (error) throw error;
  if (hideArchived) return rpcData.filter((t: any) => !t.table_archived);
  return rpcData;
};

export const getTable = async (tableId: string, headersOnly = false) => {
  await waitForSession();

  const isUuid = checkIfUuid(tableId);

  const { data: rpcData, error } = await supabase.rpc('get_app_table', {
    [isUuid ? '_table_id' : '_table_name']: tableId,
    _headers_only: headersOnly,
  });

  if (error) {
    if (error.message === 'Table not found') return null;
    throw error;
  }
  return rpcData;
};

export const updateTable = async (tableId: string, tableData: TableData) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('update_app_table', {
    _table_id: tableId,
    _name: tableData._name,
    _description: tableData._description,
    _archived: tableData._archived,
  });

  if (error) throw error;
  return rpcData;
}


/* - - - - - - - - - - Cell RPCs - - - - - - - - - - *
* Create Column
* Create Row
* Upsert Cell
* Archive Column
* Archive Rows
*/


export type CellDataTypes = '_value_text' | '_value_number' | '_value_boolean' | '_value_date' | '_value_json';

type CellData = {
  _col_id: string;
  _row_id: string;
} & (
    | { _data_type: '_value_text'; _value: string }
    | { _data_type: '_value_number'; _value: number }
    | { _data_type: '_value_boolean'; _value: boolean }
    | { _data_type: '_value_date'; _value: Date | string }
    | { _data_type: '_value_json'; _value: Record<string, any> | any[] }
  );

export const updateCells = async (cellData: CellData[]) => {
  await waitForSession();
  const payload = cellData.map((cell) => {
    return {
      _col_id: cell._col_id,
      _row_id: cell._row_id,
      [cell._data_type]: cell._value
    };
  });
  console.log("Updating cells", JSON.stringify(payload, null, 2));
  const { data, error } = await supabase.rpc('update_app_cells', {
    _cell_data: payload,
  });

  if (error) throw error;
  return data;
};

type ColumnData = {
  _name: string;
  _data_type: CellDataTypes;
  _config: string;
  _is_required: boolean;
}

export const createColumn = async (tableId: string, columnData: ColumnData) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('create_app_column', {
    _table_id: tableId,
    _name: columnData._name,
    _data_type: columnData._data_type,
    _config: columnData._config,
    _is_required: columnData._is_required,
  });

  if (error) throw error;
  return rpcData;
};

export const createRow = async (tableId: string) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('create_app_row', {
    _table_id: tableId,
  });

  if (error) throw error;
  return rpcData;
};


export const archiveColumn = async (colId: string) => {
  await waitForSession();

  const { data: rpcData, error } = await supabase.rpc('archive_app_column', {
    _col_id: colId,
  });

  if (error) throw error;
  return rpcData;
};

export const deleteRows = async (rowIds: string[]) => {
  await waitForSession();

  console.log("Deleting rows", rowIds);
  const { data: rpcData, error } = await supabase.rpc('delete_app_rows', {
    _row_ids: rowIds,
  });
  console.log(JSON.stringify(rpcData, null, 2));

  if (error) throw error;
  return rpcData;
};