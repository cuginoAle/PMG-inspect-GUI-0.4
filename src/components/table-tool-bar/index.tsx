'use client';

import { AugmentedProjectItemData } from '@/src/types';
import { Flex, IconButton } from '@radix-ui/themes';
import { Table } from '@tanstack/react-table';
import styles from './style.module.css';
import {
  PageCount,
  PageButtons,
} from 'components/project-table-view/pagination';
import { Share2Icon } from '@radix-ui/react-icons';
import { useModal } from '@/src/hooks/fetchers/useModal';
import { ExportTable } from './export-table';
const TableToolBar = ({
  table,
}: {
  table: Table<AugmentedProjectItemData>;
}) => {
  const [Modal, modalRef] = useModal();

  return (
    <Flex
      gap="2"
      align="center"
      justify="between"
      className={styles.paginationControls}
    >
      <Modal ref={modalRef}>
        <div className={styles.modalContent}>
          <ExportTable onClose={() => modalRef.current?.close()} />
        </div>
      </Modal>
      <PageButtons table={table} />
      <Flex gap="4" align="center">
        <PageCount table={table} />
        <IconButton
          variant="soft"
          size="2"
          type="button"
          title="Export table data"
          onClick={() => modalRef.current?.showModal()}
        >
          <Share2Icon width={18} height={18} />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export { TableToolBar };
