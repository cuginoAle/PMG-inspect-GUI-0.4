import { Table } from '@tanstack/react-table';
import { Flex } from '@radix-ui/themes';
import styles from './style.module.css';
import { AugmentedProjectItemData } from '@/src/types/api';

const PageCount = ({ table }: { table: Table<AugmentedProjectItemData> }) => {
  return (
    <Flex gap="2" align="center">
      <span className={styles.paginationText}>
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong>/
        {table.getPageCount()}
      </span>
      |
      <span className={styles.paginationText}>
        {table.getFilteredRowModel().rows.length} rows
      </span>
    </Flex>
  );
};

export { PageCount };
