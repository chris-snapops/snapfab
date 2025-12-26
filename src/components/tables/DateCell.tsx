import { Box, Input } from "@mantine/core";
import { DateInput } from "@mantine/dates";


const DateCell = ({ getValue, row, column, table }: any) => {
  const date = getValue();
  const { updateData } = table.options.meta;
  return (
    <>
      <DateInput
        value={date}
        onChange={(date) => updateData(row.index, column.id, date)}
        valueFormat="MMM D, YYYY"
        variant="filled"
        p="4px 8px"
        size="sm"
        w="100%"
        h="100%"
        rightSection={  
          date ? (
            <Input.ClearButton
              onClick={() => updateData(row.index, column.id, null)}
              style={{ transform: 'none' }}
            />
          ) : null
        }
      />
    </>

  );
};

export default DateCell;