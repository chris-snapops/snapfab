import { TextInput } from "@mantine/core";
import { useEffect, useState, ChangeEvent } from "react";

const StringCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TextInput
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      variant="filled"
      p="4px 8px"
      size="sm"
      w="100%"
      h="100%"
    />
  );
};

export default StringCell;