'use client';
import React, { useId } from 'react';
import styles from './style.module.css';
import { useDebounce } from '@/src/hooks/useDebounce';

const MyTable = ({
  header,
  body,
  onMouseOver,
  onRowClick,
}: {
  header: React.ReactNode[];
  body: React.ReactNode[][];
  onMouseOver?: (rowIndex?: number) => void;
  onRowClick?: (rowIndex: number) => void;
}) => {
  const uid = useId();
  const debouncedOnRowClick = useDebounce(onRowClick || (() => void 0), 30);
  const debouncedMouseEnter = useDebounce(onMouseOver || (() => void 0), 30);
  return (
    <section className={styles.root}>
      <table cellSpacing={0} className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {header.map((head, index) => (
              <th key={index}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onMouseEnter={() => debouncedMouseEnter?.(rowIndex)}
              onMouseLeave={() => debouncedMouseEnter?.()}
              onClick={() => debouncedOnRowClick(rowIndex)}
              className={styles.tableRow}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cell}
                  {cellIndex === 0 && (
                    <label className={styles.radioLabel}>
                      <input type="radio" name={uid} value={rowIndex} />
                    </label>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export { MyTable };
