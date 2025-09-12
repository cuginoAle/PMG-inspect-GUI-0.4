'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Project } from '@/src/app/protected/api/project/types/project';
import { Flex, Table, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import { columns } from './helpers/columns-def';
import { getColumnSortIcon } from './helpers/columnSortIcon';

const ProjectTableView = ({
  project,
  onRowSelect,
  onRowDoubleClick,
  defaultSelectedRowIndex = 0,
}: {
  project: Project;
  onRowSelect: (index: number) => void;
  onRowDoubleClick?: (index: number) => void;
  defaultSelectedRowIndex?: number;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    [defaultSelectedRowIndex.toString()]: true,
  });

  const table = useReactTable({
    data: project.roads,
    columns: columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  return (
    <Flex direction="column" gap="2">
      <div className={styles.searchBox}>
        <TextField.Root
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          size={'3'}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon width="24" height="24" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <Table.Root variant="surface">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeaderCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  <Flex align="center" gap="1" className={styles.headerCell}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {getColumnSortIcon(header.column.getIsSorted()) ?? null}
                  </Flex>
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row, index) => (
            <Table.Row
              key={row.id}
              tabIndex={0}
              className={row.getIsSelected() ? styles.selected : ''}
              onClick={() => {
                row.toggleSelected(true);
                onRowSelect?.(index);
              }}
              onDoubleClick={() => onRowDoubleClick?.(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  row.toggleSelected(true);
                  onRowSelect?.(index);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export { ProjectTableView };
