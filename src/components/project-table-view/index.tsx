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
import { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, Table, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import { columns } from './helpers/columns-def';
import { getColumnSortIcon } from './helpers/columnSortIcon';
import { Project, ProjectItem } from '@/src/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRowId } from './helpers/getRowId';

const ProjectTableView = ({
  project,
  onMouseOver,
}: {
  project: Project;
  onMouseOver?: (projectIterm?: ProjectItem) => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const tBodyRef = useRef<HTMLTableSectionElement>(null);

  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const router = useRouter();

  const onRowSelect = useCallback(
    (projectItem?: ProjectItem) => {
      if (!projectItem) return;
      const urlSearchParams = new URLSearchParams(searchParams.toString());
      urlSearchParams.set('videoUrl', projectItem.video_url);

      tBodyRef.current
        ?.querySelector(`[id="${getRowId(projectItem)}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.history.pushState(
        null,
        '',
        `/protected?${urlSearchParams.toString()}`,
      );
    },
    [searchParams],
  );

  useEffect(() => {
    const selectedRowIndex = Math.max(
      project?.project_items.findIndex((item) => item.video_url === videoUrl),
      0,
    );

    setRowSelection({ [selectedRowIndex]: true });
    const selectedRow = project?.project_items[selectedRowIndex];
    onRowSelect(selectedRow);
  }, [onRowSelect, project?.project_items, videoUrl]);

  const onRowDoubleClick = (projectItem: ProjectItem) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set('videoUrl', projectItem.video_url);

    router.push(`/protected/edit?${urlSearchParams.toString()}`);
  };

  const table = useReactTable({
    data: project.project_items,
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
    <Flex direction="column" gap="2" height={'100%'}>
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

      <div className={styles.tableContainer}>
        <Table.Root size={'1'} variant="surface" className={styles.tableRoot}>
          <Table.Header className={styles.tableHeader}>
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
          <Table.Body ref={tBodyRef}>
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                id={getRowId(row.original)}
                tabIndex={0}
                className={row.getIsSelected() ? styles.selected : ''}
                onMouseEnter={() => {
                  onMouseOver?.(row.original);
                }}
                onMouseLeave={() => {
                  onMouseOver?.(undefined);
                }}
                onClick={() => {
                  row.toggleSelected(true);
                  onRowSelect?.(row.original);
                }}
                onDoubleClick={() => {
                  onRowDoubleClick(row.original);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    row.toggleSelected(true);
                    onRowSelect?.(row.original);
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
      </div>
    </Flex>
  );
};

export { ProjectTableView };
