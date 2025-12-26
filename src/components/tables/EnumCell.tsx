import { Menu, Button, UnstyledButton, Group, Text, Box } from "@mantine/core";
import { STATUSES, Status } from "../../../public/temptabledata";

interface ColorIconProps {
  color?: string;
}

const ColorIcon = ({ color }: ColorIconProps) =>
  <Box w={12} h={12} bg={color} style={{ borderRadius: '3px' }} />;

const EnumCell = ({ getValue, row, column, table }: any) => {
  const { name, color } = (getValue() as Status) || {};
  const { updateData } = table.options.meta || {};

  return (
    <Menu shadow="md" width={200} position="bottom-start" withinPortal={false}>
      <Menu.Target>
        <UnstyledButton
          h="100%"
          w="100%"
          p={8}
          bg={color}
          style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 'var(--mantine-font-size-sm)',
            textAlign: 'left'
          }}
        >
          {name}
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => updateData(row.index, column.id, null)}
          leftSection={<ColorIcon color="var(--mantine-color-gray-4)" />}
        >
          None
        </Menu.Item>
        {STATUSES.map(status => (
          <Menu.Item
            key={status.id}
            onClick={() => updateData(row.index, column.id, status)}
            leftSection={<ColorIcon color={status.color} />}
          >
            {status.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default EnumCell;