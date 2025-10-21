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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Flex, Table, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import { useColumnsDef } from './helpers/columns-def';
import { getColumnSortIcon } from './helpers/columnSortIcon';
import {
  AugmentedProject,
  AugmentedProjectItemData,
  ProcessingConfiguration,
} from '@/src/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRowId } from './helpers/getRowId';
import { scrollChildIntoView } from '@/src/helpers/scrollChildIntoView';
import { getVideoId } from './helpers/getVideoId';

const ProjectTableView = ({
  processingConfiguration = [],
  project,
  onMouseOver,
  onRowCheckbox,
  onRowClick,
  onConfigurationChange,
}: {
  processingConfiguration?: ProcessingConfiguration[];
  project: AugmentedProject;
  onMouseOver?: (projectItem?: AugmentedProjectItemData) => void;
  onRowCheckbox?: (selectedItemIdList: string[] | []) => void;
  onRowClick?: (projectItem?: AugmentedProjectItemData) => void;
  onConfigurationChange?: (videoId: string, selectedValue: string) => void;
}) => {
  // const [selectedRowCheckbox, setSelectedRowCheckbox] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const tBodyRef = useRef<HTMLTableSectionElement>(null);

  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const router = useRouter();

  const projectItems = useMemo(
    () => Object.values(project.items || {}),
    [project.items],
  );

  const onFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const form = (e.target as HTMLInputElement).closest(
      'form',
    ) as HTMLFormElement;
    const formData = new FormData(form);
    const target = e.target as HTMLElement;

    // Handle different input types
    switch (target.tagName) {
      case 'INPUT':
        const checkedValues = formData.getAll('selected') as string[];

        // setSelectedRowCheckbox(checkedValues);
        // onRowCheckbox?.(checkedValues);
        break;
      case 'SELECT':
        const videoUrl = target.dataset['videoId'] as string;
        const videoId = getVideoId({
          projectName: project.project_name,
          videoUrl: videoUrl,
        });
        const selectedValue = (target as HTMLSelectElement).value;

        onConfigurationChange?.(videoId, selectedValue);
        break;
    }
  };

  const onRowSelect = useCallback(
    (projectItem?: AugmentedProjectItemData) => {
      if (!projectItem) return;
      const item = projectItem;
      const urlSearchParams = new URLSearchParams(searchParams.toString());
      urlSearchParams.set('videoUrl', item.video_url);

      scrollChildIntoView({
        container: tBodyRef.current!,
        child: tBodyRef.current!.querySelector(`[id="${getRowId(item)}"]`)!,
        behavior: 'smooth',
        direction: 'vertical',
      });

      window.history.pushState(
        null,
        '',
        `/protected?${urlSearchParams.toString()}`,
      );
    },
    [searchParams],
  );

  useEffect(() => {
    if (!projectItems.length) return;

    const selectedRowIndex = Math.max(
      projectItems.findIndex((item) => item.video_url === videoUrl),
      0,
    );

    setRowSelection({ [selectedRowIndex]: true });
    const item = projectItems[selectedRowIndex] as AugmentedProjectItemData;
    if (!videoUrl) {
      onRowSelect(item);
    } else {
      scrollChildIntoView({
        container: tBodyRef.current!,
        child: tBodyRef.current!.querySelector(`[id="${getRowId(item)}"]`)!,
        behavior: 'smooth',
        direction: 'vertical',
      });
    }
  }, [onRowSelect, projectItems, videoUrl]);

  const onRowDoubleClick = (projectItem: AugmentedProjectItemData) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set('videoUrl', projectItem.video_url);

    router.push(`/protected/edit?${urlSearchParams.toString()}`);
  };

  const tableData = useMemo(
    // Spread to create a mutable array for @tanstack/react-table (original is Immutable/readonly)
    () => [...projectItems] as AugmentedProjectItemData[],
    [projectItems],
  );

  const table = useReactTable({
    data: tableData,
    columns: useColumnsDef({
      processingConfiguration,
    }),
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
    <form onChange={onFormChange}>
      <Flex direction="column" gap="2" height={'100%'}>
        <div className={styles.searchBox}>
          <TextField.Root
            placeholder="Search all columns..."
            value={globalFilter ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGlobalFilter(e.target.value)
            }
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
                      style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                    >
                      <Flex
                        align="center"
                        gap="1"
                        className={styles.headerCell}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {getColumnSortIcon(header.column.getIsSorted()) ?? null}

                        {header.column.columnDef.id === 'select_all' && (
                          <input
                            title="Select All"
                            id="selectAllCheckbox"
                            type="checkbox"
                            // checked={
                            //   selectedRowCheckbox.length > 0 &&
                            //   selectedRowCheckbox.length === tableData.length
                            // }
                            onChange={() => void 0}
                            onClick={(e) => {
                              tBodyRef.current
                                ?.querySelectorAll('input[type="checkbox"]')
                                .forEach((checkbox) => {
                                  (checkbox as HTMLInputElement).checked =
                                    e.currentTarget.checked;
                                });
                              return false;
                            }}
                          />
                        )}
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
                  style={{
                    contentVisibility: 'auto',
                    containIntrinsicSize: 'auto 40px',
                    cursor: 'pointer',
                  }}
                  className={row.getIsSelected() ? styles.selected : ''}
                  onMouseEnter={() => {
                    onMouseOver?.(row.original as AugmentedProjectItemData);
                  }}
                  onMouseLeave={() => {
                    onMouseOver?.(undefined);
                  }}
                  onClick={() => {
                    row.toggleSelected(true);
                    // onRowSelect?.(row.original);
                    // onRowClick?.(row.original);
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </Flex>
    </form>
  );
};

export { ProjectTableView };
