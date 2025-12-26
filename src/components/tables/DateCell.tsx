// https://mantine.dev/dates/date-input/

import { Input, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const DateCell = ({ getValue, row, column, table }: any) => {
  const date = getValue();
  const { updateData } = table.options.meta;
  const theme = useMantineTheme();
  
  return (
    <>
      <DateInput
        value={date}
        onChange={(date) => updateData(row.index, column.id, date)}
        valueFormat={theme.other.dateValueFormat}
        firstDayOfWeek={0}
        variant="filled"
        p="4px 8px"
        size="sm"
        w="100%"
        h="100%"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
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