import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { Column, Row } from "./formulaEngine";

export async function saveTable(
  tableId: string,
  name: string,
  columns: Column[],
  rows: Row[]
) {
  await setDoc(doc(db, "tables", tableId), { name });

  const colCol = collection(db, "tables", tableId, "columns");
  for (const col of columns) {
    await setDoc(doc(colCol, col.id), col);
  }

  const rowCol = collection(db, "tables", tableId, "rows");
  for (const row of rows) {
    await setDoc(doc(rowCol, row.id), { values: row.values });
  }
}

export async function loadTable(tableId: string) {
  const tableSnap = await getDoc(doc(db, "tables", tableId));
  if (!tableSnap.exists()) return null;
  const name = tableSnap.data().name;

  const columnsSnap = await getDocs(collection(db, "tables", tableId, "columns"));
  const columns: Column[] = columnsSnap.docs.map((d) => d.data() as Column);

  const rowsSnap = await getDocs(collection(db, "tables", tableId, "rows"));
  const rows: Row[] = rowsSnap.docs.map((d) => ({
    id: d.id,
    values: (d.data() as DocumentData).values,
  }));

  return { tableId, name, columns, rows };
}