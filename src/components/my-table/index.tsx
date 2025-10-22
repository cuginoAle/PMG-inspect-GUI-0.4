'use client';
import React, { useId, forwardRef } from 'react';
import styles from './style.module.css';
import { useDebounce } from '@/src/hooks/useDebounce';

const MyTable = forwardRef<
  HTMLTableElement,
  {
    header: React.ReactNode[];
    body: [string, React.ReactNode[]][];
    onMouseOver?: (rowId?: string) => void;
    onRowClick?: (rowId: string) => void;
    defaultSelectedRowId?: string;
  }
>(({ header, body, onMouseOver, onRowClick, defaultSelectedRowId }, ref) => {
  const uid = `${useId()}-selected-row`;
  const debouncedOnRowClick = useDebounce(onRowClick || (() => void 0), 30);
  const debouncedMouseEnter = useDebounce(onMouseOver || (() => void 0), 30);

  return (
    <section className={styles.root}>
      <table ref={ref} cellSpacing={0} className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {header.map((head, index) => (
              <th key={index}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => {
            const id = row[0];
            return (
              <tr
                key={id}
                onMouseEnter={() => debouncedMouseEnter?.(id)}
                onMouseLeave={() => debouncedMouseEnter?.()}
                className={styles.tableRow}
              >
                {row[1].map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cell}
                    {cellIndex === 0 && (
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name={uid}
                          value={id}
                          onChange={() => debouncedOnRowClick(id)}
                          defaultChecked={id === defaultSelectedRowId}
                        />
                      </label>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
});

MyTable.displayName = 'MyTable';

export { MyTable };
