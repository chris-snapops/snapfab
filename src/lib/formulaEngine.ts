type TableData = {
  columns: Column[];
  rows: Row[];
};

export type ColumnType = "string" | "number" | "boolean";

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  formula?: string;
}

export interface Row {
  id: string;
  values: Record<string, string | number | boolean | null>;
}

// totally untested, just copy pasted from chatgpt on dec 19

type RowValues = Record<string, string | number | boolean | null>;
type Tables = Record<string, { columns: string[], rows: RowValues[] }>;

function evaluateFormula(
  formula: string,
  rowValues: RowValues,
  tables?: Tables
): string | number | boolean | null {
  if (!formula.startsWith("=")) return formula;

  formula = formula.slice(1).trim();

  // very simple recursive parser skeleton
  function evalExpr(expr: string): any {
    // parse numbers
    if (/^\d+(\.\d+)?$/.test(expr)) return Number(expr);

    // parse string literals
    if (/^'.*'$/.test(expr)) return expr.slice(1, -1);

    // parse column references
    if (rowValues[expr] !== undefined) return rowValues[expr];

    // parse functions
    const fnMatch = expr.match(/^([A-Z]+)\((.*)\)$/i);
    if (fnMatch) {
      const fnName = fnMatch[1].toUpperCase();
      const argsStr = fnMatch[2];

      // simple split args by comma (handle nested later)
      const args = splitArgs(argsStr).map(evalExpr);

      switch (fnName) {
        case "IF": return args[0] ? args[1] : args[2];
        case "SUM": return args.reduce((a,b)=>Number(a)+Number(b),0);
        case "AND": return args.every(Boolean);
        case "OR": return args.some(Boolean);
        case "LOOKUP":
          // LOOKUP(key, tableName!keyCol, tableName!valueCol)
          const [key, keyRef, valueRef] = args;
          if (!tables) throw new Error("LOOKUP needs tables");
          const [tableName, keyCol] = keyRef.split("!");
          const [, valueCol] = valueRef.split("!");
          const table = tables[tableName];
          if (!table) return null;
          const found = table.rows.find(r => r[keyCol] === key);
          return found ? found[valueCol] : null;
        default: throw new Error(`Unknown function: ${fnName}`);
      }
    }

    throw new Error("Cannot parse: " + expr);
  }

  return evalExpr(formula);
}

function splitArgs(argsStr: string): string[] {
  // simple split on commas for now (needs nesting support later)
  return argsStr.split(",").map(s => s.trim());
}