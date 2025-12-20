import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { columns, rows } = await req.json();

  // Save columns
  for (const col of columns) {
    await query(
      `INSERT INTO columns (id, name, type) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = $2, type = $3`,
      [col.id, col.name, col.type]
    );
  }

  // Save rows and values
  for (const row of rows) {
    await query(
      `INSERT INTO rows (id) VALUES ($1)
       ON CONFLICT (id) DO NOTHING`,
      [row.id]
    );

    for (const [colId, val] of Object.entries(row.values)) {
      let valueStr: string | null;

      if (val === null || val === undefined) {
        valueStr = null;
      } else {
        valueStr = val.toString();
      }

      await query(
        `INSERT INTO row_values (row_id, column_id, value)
         VALUES ($1, $2, $3)
         ON CONFLICT (row_id, column_id) DO UPDATE SET value = $3`,
        [row.id, colId, valueStr]
      );
    }
  }

  return NextResponse.json({ success: true });
}