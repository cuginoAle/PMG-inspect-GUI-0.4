import { Flex, Spinner } from '@radix-ui/themes';
import styles from './style.module.css';
import { Table } from '@tanstack/react-table';
import { AugmentedProjectItemData } from '@/src/types';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import classNames from 'classnames';

const Pagination = ({ table }: { table: Table<AugmentedProjectItemData> }) => {
  const sp = useSearchParams();
  const searchParams = new URLSearchParams(sp.toString());
  const page = searchParams.get('page') || '0';
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(false);
  }, [page]);

  const currentPage = table.getState().pagination.pageIndex;

  const firstPage = 0;
  const lastPage = table.getPageCount() - 1;
  const previousPage = Math.max(currentPage - 1, 0);
  const nextPage = Math.min(currentPage + 1, lastPage);

  const getNextPageLink = () => {
    if (!table.getCanNextPage()) return '';
    searchParams.set('page', nextPage.toString());
    return `?${searchParams.toString()}`;
  };

  const getPreviousPageLink = () => {
    if (!table.getCanPreviousPage()) return '';
    searchParams.set('page', previousPage.toString());
    return `?${searchParams.toString()}`;
  };

  const getFirstPageLink = () => {
    if (!table.getCanPreviousPage()) return '';
    searchParams.set('page', firstPage.toString());
    return `?${searchParams.toString()}`;
  };

  const getLastPageLink = () => {
    if (!table.getCanNextPage()) return '';
    searchParams.set('page', lastPage.toString());
    return `?${searchParams.toString()}`;
  };

  const cn = classNames(styles.ctasContainer, {
    [styles.spinnerVisible]: loading,
  });

  return (
    <Flex
      gap="2"
      align="center"
      justify="between"
      className={styles.paginationControls}
    >
      <Flex gap="2" align="center" className={cn}>
        <div className={styles.spinner}>
          <Spinner size="3" />
        </div>

        <Link
          type="button"
          onClick={() => {
            table.firstPage();
            setLoading(true);
          }}
          href={getFirstPageLink()}
          className={`${styles.paginationButton} ${
            currentPage === 0 ? styles.disabled : ''
          }`}
        >
          <DoubleArrowLeftIcon />
        </Link>
        <Link
          type="button"
          onClick={() => {
            table.previousPage();
            setLoading(true);
          }}
          href={getPreviousPageLink()}
          className={`${styles.paginationButton} ${
            currentPage === 0 ? styles.disabled : ''
          }`}
        >
          <ChevronLeftIcon />
        </Link>
        <Link
          type="button"
          href={getNextPageLink()}
          onClick={() => {
            table.nextPage();
            setLoading(true);
          }}
          className={`${styles.paginationButton} ${
            currentPage === lastPage ? styles.disabled : ''
          }`}
        >
          <ChevronRightIcon />
        </Link>
        <Link
          type="button"
          href={getLastPageLink()}
          onClick={() => {
            table.lastPage();
            setLoading(true);
          }}
          className={`${styles.paginationButton} ${
            currentPage === lastPage ? styles.disabled : ''
          }`}
        >
          <DoubleArrowRightIcon />
        </Link>
      </Flex>
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
    </Flex>
  );
};

export { Pagination };
