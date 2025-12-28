import { Menu, Button, Group, Box } from "@mantine/core";

interface ColorIconProps {
  color?: string;
}

const ColorIcon = ({ color }: ColorIconProps) =>
  <Box w={10} h={10} bg={color || 'gray'} style={{ borderRadius: '50%' }} />;

const EnumCell = ({ getValue, row, column, table }: any) => {
  const value = getValue();
  const { updateData } = table.options.meta || {};
  
  // Pull options from the column metadata we set up in TablePage
  const options = column.columnDef.meta?.config?.options || [];

  // Determine display name and color
  // This handles both object values { name, color } and simple string values
  const displayName = typeof value === 'object' ? value?.name : value;
  const displayColor = typeof value === 'object' ? value?.color : "gray";

  return (
    <Group justify="center" h="100%" w="100%" px={8}>
      <Menu shadow="md" width={200} position="bottom-start" withinPortal={false}>
        <Menu.Target>
          <Button
            variant="light"
            color={displayColor || "gray"}
            fullWidth
            style={{ 
              fontWeight: 600,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {displayName || ""}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => updateData(row.index, column.id, null)}
            leftSection={<ColorIcon color="transparent" />}
          >
            None
          </Menu.Item>
          
          {options.map((opt: any) => {
            // Support both string arrays ["kg", "lb"] and object arrays [{name: 'kg', color: 'blue'}]
            const label = typeof opt === 'object' ? opt.name : opt;
            const optColor = typeof opt === 'object' ? opt.color : undefined;
            
            return (
              <Menu.Item
                key={label}
                onClick={() => updateData(row.index, column.id, opt)}
                leftSection={<ColorIcon color={optColor} />}
              >
                {label}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default EnumCell;