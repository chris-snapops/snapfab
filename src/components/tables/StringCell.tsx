import { TextInput } from "@mantine/core";
import { useEffect, useState, ChangeEvent } from "react";

const StringCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TextInput
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      onBlur={onBlur}
      variant="unstyled"
      size="sm"
      w="100%"
      styles={{
        root: {
          width: '100%',
        },
        input: {
          padding: '8px 12px',
          height: '40px',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderRadius: 0,
          '&:focus': {
            outline: '2px solid var(--mantine-color-blue-filled)',
            zIndex: 1
          }
        }
      }}
    />
  );
};

export default StringCell;