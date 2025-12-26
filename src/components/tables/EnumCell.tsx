import { Menu, Button, Group, Box } from "@mantine/core";
import { STATUSES, Status } from "../../../public/temptabledata";

interface ColorIconProps {
  color?: string;
}

const ColorIcon = ({ color }: ColorIconProps) =>
  <Box w={10} h={10} bg={color} style={{ borderRadius: '50%' }} />;

const EnumCell = ({ getValue, row, column, table }: any) => {
  const { name, color } = (getValue() as Status) || {};
  const { updateData } = table.options.meta || {};

  return (
    <Group justify="center" h="100%" w="100%" px={8}>
      <Menu shadow="md" width={200} position="bottom-start" withinPortal={false}>
        <Menu.Target>
          <Button
            size="compact-sm"
            variant="light"
            color={color || "gray"}
            fullWidth
            radius="xl"
            style={{ 
              fontWeight: 600,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {name || "-"}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => updateData(row.index, column.id, null)}
            leftSection={<ColorIcon color="gray" />}
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
    </Group>
  );
};

export default EnumCell;