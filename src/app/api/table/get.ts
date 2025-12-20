import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const columnsRes = await query("SELECT * FROM columns ORDER BY name");
  const rowsRes = await query("SELECT * FROM rows");

  const rowValuesRes = await query("SELECT * FROM row_values");

  // Reconstruct rows with values
  const rows = rowsRes.rows.map((row) => {
    const values: Record<string, any> = {};
    rowValuesRes.rows
      .filter((rv) => rv.row_id === row.id)
      .forEach((rv) => {
        values[rv.column_id] = rv.value === null ? null :
                               rv.value === "true" ? true :
                               rv.value === "false" ? false :
                               isNaN(Number(rv.value)) ? rv.value : Number(rv.value);
      });
    return { id: row.id, values };
  });

  return NextResponse.json({ columns: columnsRes.rows, rows });
}