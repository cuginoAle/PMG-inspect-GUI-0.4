'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { useDebounce } from '@/src/hooks/useDebounce';
import { Pagination } from './pagination';
import { selectAllCheckboxHandler } from './helpers/select-all-checkbox-handler';
import { LinkMapAndTableBtn } from '@/src/components';
import { useGlobalState } from '@/src/app/global-state';
import { PageSizer } from './page-sizer';

const ProjectTableView = ({
  processingConfiguration = [],
  project,
  onMouseOver,
  onRowClick,
  onConfigurationChange,
}: {
  processingConfiguration?: ProcessingConfiguration[];
  project: AugmentedProject;
  onMouseOver?: (projectItem?: AugmentedProjectItemData) => void;
  onRowClick?: (projectItem?: AugmentedProjectItemData) => void;

  onConfigurationChange?: ({
    projectName,
    itemIds,
    configurationId,
  }: {
    projectName: string;
    itemIds: string[];
    configurationId: string | undefined;
  }) => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const searchParams = useSearchParams();
  const tBodyRef = useRef<HTMLTableSectionElement>(null);
  const checkedRowIdsRef = useRef<Set<string>>(new Set());

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const videoUrl = searchParams.get('videoUrl') || '';
  const projectPath = searchParams.get('path') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const router = useRouter();

  const paginationPageSize = useGlobalState(
    (state) => state.paginationPageSize,
  );

  const setRenderedProjectItems = useGlobalState(
    (state) => state.setRenderedProjectItems,
  );

  const projectItems = useMemo(
    () => Object.values(project.items || {}),
    [project.items],
  );

  const debouncedOnSearchChange = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(e.target.value);
    },
    300,
  );

  const onFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;

    // Handle different input types
    const isSelectAllCheckbox =
      target.dataset['componentId'] === 'select_all_header_checkbox';
    switch (target.tagName) {
      case 'INPUT':
        if (isSelectAllCheckbox) {
          const isChecked = (target as HTMLInputElement).checked;
          const checkedValues = isChecked
            ? projectItems.map((item) => item.video_url)
            : [];

          checkedRowIdsRef.current = new Set(isChecked ? checkedValues : []);
          // Get all checked checkbox values

          updateAllCheckboxes((target as HTMLInputElement).checked);
          updateAllConfigDropdowns(checkedValues);
          break;
        }

        if (!(target as HTMLInputElement).checked) {
          checkedRowIdsRef.current.delete((target as HTMLInputElement).value);
        } else {
          checkedRowIdsRef.current.add((target as HTMLInputElement).value);
        }

        // Get all checked checkbox values (including the current change)
        const updatedCheckedValues = Array.from(checkedRowIdsRef.current);
        updateAllConfigDropdowns(updatedCheckedValues);
        break;

      case 'SELECT':
        const selectedVideoUrl = target.dataset['videoId']!;
        const checkedValues = Array.from(checkedRowIdsRef.current);
        const allAffectedVideoUrls = [...checkedValues];

        if (checkedValues.length === 0) {
          allAffectedVideoUrls.push(selectedVideoUrl);
        }

        // Get selected value from the changed select element
        const selectedValue = (target as HTMLSelectElement).value;

        setTimeout(() => {
          // Optimistically update the select dropdown(s)
          target.closest('select')!.value = selectedValue;
        }, 0);

        onConfigurationChange?.({
          projectName: project.project_name,
          itemIds: allAffectedVideoUrls,
          configurationId:
            selectedValue ===
            processingConfiguration[0]?.processing_configuration_name
              ? undefined
              : selectedValue,
        });

        break;
    }
  };

  const onRowSelect = useCallback((projectItem?: AugmentedProjectItemData) => {
    if (!projectItem) return;
    const item = projectItem;

    // using non-reactive SearchParam
    const videoUrl = new URLSearchParams(window.location.search).get(
      'videoUrl',
    );

    if (videoUrl === item.video_url) return;
    const urlSearchParams = new URLSearchParams(
      new URLSearchParams(window.location.search || '').toString(),
    );

    urlSearchParams.set('videoUrl', item.video_url);

    window.history.pushState(
      null,
      '',
      `/protected?${urlSearchParams.toString()}`,
    );
  }, []);

  useEffect(() => {
    if (
      !projectItems.length ||
      projectPath !== project.project_file.split('/').pop()
    )
      return;

    const selectedRowIndex = Math.max(
      projectItems.findIndex((item) => item.video_url === videoUrl),
      0,
    );

    setRowSelection({ [selectedRowIndex]: true });

    const item = projectItems[selectedRowIndex] as AugmentedProjectItemData;

    onRowSelect(item);
    scrollChildIntoView({
      container: tBodyRef.current?.closest(
        '.rt-ScrollAreaViewport',
      ) as HTMLElement,
      child:
        tBodyRef.current!.querySelector(`[id="${getRowId(item)}"]`) ||
        tBodyRef.current!.querySelector(`tr:first-child`)!,
      behavior: 'smooth',
      direction: 'vertical',
    });
  }, [
    onRowSelect,
    project.project_file,
    project.project_name,
    projectItems,
    projectPath,
    videoUrl,
    page,
  ]);

  const onRowDoubleClick = (projectItem: AugmentedProjectItemData) => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set('videoUrl', projectItem.video_url);

    router.push(`/protected/edit?${urlSearchParams.toString()}`);
  };

  const table = useReactTable({
    data: projectItems,
    columns: useColumnsDef({
      processingConfiguration,
      checkedRowIds: Array.from(checkedRowIdsRef.current),
    }),
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination: {
        pageIndex: page,
        pageSize: paginationPageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
  });

  useEffect(() => {
    const currentPage = table.getState().pagination.pageIndex;
    const resultsLength = table.getRowModel().rows.length;
    const sp = new URLSearchParams(window.location.search);

    if (globalFilter && resultsLength == 0 && currentPage !== 0) {
      sp.delete('page');
      router.push(`/protected?${sp.toString()}`);
    }
  }, [globalFilter, router, table]);

  const { updateAllCheckboxes, updateAllConfigDropdowns } =
    selectAllCheckboxHandler({
      tBodyRef,
      projectItems,
      selectAllCheckboxRef,
    });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    setRenderedProjectItems(
      rows.reduce<Record<string, AugmentedProjectItemData>>((acc, row) => {
        acc[row.original.video_url] = row.original as AugmentedProjectItemData;
        return acc;
      }, {}),
    );
  }, [rows, setRenderedProjectItems]);

  return (
    <form onChange={onFormChange} style={{ minHeight: '0' }}>
      <Flex direction="column" gap="2" height={'100%'}>
        <Flex align="center" justify="between" gap={'2'}>
          <div className={styles.searchBox}>
            <TextField.Root
              placeholder="Search all columns..."
              onChange={debouncedOnSearchChange}
              size={'3'}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon width="24" height="24" />
              </TextField.Slot>
            </TextField.Root>
          </div>

          <Flex align="center" gap="4">
            <PageSizer min={10} max={60} step={5} />
            <LinkMapAndTableBtn />
          </Flex>
        </Flex>
        <Pagination table={table} />

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
                            data-component-id="select_all_header_checkbox"
                            type="checkbox"
                            ref={selectAllCheckboxRef}
                            defaultChecked={
                              checkedRowIdsRef.current.size ===
                              projectItems.length
                            }
                            onChange={(e) => {
                              const isChecked = e.currentTarget.checked;
                              updateAllCheckboxes(isChecked);
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
                    onRowSelect?.(row.original);
                    onRowClick?.(row.original);

                    row.toggleSelected(true);
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
