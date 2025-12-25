import { Menu, MenuButton, MenuList, MenuItem, Box, BoxProps } from "@chakra-ui/react"
import { STATUSES, Status } from "../../../public/temptabledata"

interface ColorIconProps extends BoxProps {
  color?: string
}

const ColorIcon = ({ color, ...props }: ColorIconProps) =>
  <Box w="12px" h="12px" bg={color} borderRadius="3px" {...props} />


const EnumCell = ({ getValue, row, column, table }: any) => {
  const { name, color } = (getValue() as Status) || {};
  const { updateData } = table.options.meta || {};

  return (
    <Menu
      isLazy
      offset={[0, 0]}
      flip={false}
      autoSelect={false}
    >
      <MenuButton
        h="100%"
        w="100%"
        textAlign="left"
        p={1.5}
        bg={color}
      >
        {name}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => updateData(row.index, column.id, null)}
        >
          <ColorIcon color={"gray.400"} mr={3} />
          None
        </MenuItem>
        {STATUSES.map(status =>
          <MenuItem
            onClick={() => updateData(row.index, column.id, status)}
            key={status.id}
          >
            <ColorIcon color={status.color} mr={3} />
            {status.name}
          </MenuItem>)}
      </MenuList>
    </Menu>
  )
}

export default EnumCell