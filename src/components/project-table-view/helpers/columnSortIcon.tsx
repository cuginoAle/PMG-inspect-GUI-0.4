import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { SortDirection } from '@tanstack/react-table';

const ColumnSortIcon: Record<SortDirection, React.ReactNode> = {
  asc: <ArrowUpIcon />,
  desc: <ArrowDownIcon />,
};

const getColumnSortIcon = (
  direction: SortDirection | false,
): React.ReactNode => {
  return direction ? ColumnSortIcon[direction] : null;
};

export { getColumnSortIcon };
