import styles from './Pagination.module.scss';
import { useState, useEffect } from 'react';
import { JSX } from 'react';

interface PaginationProps {
  page: number;
  setPage: (num: number) => void;
  lastPage: number;
  className: string | undefined;
}

export default function Pagination({ page, setPage, lastPage, className }: PaginationProps) {
  const [pages, setPages] = useState<number[]>();
  const delta = 3;

  useEffect(() => {
    const arr: number[] = [];
    for (let i = 1; i <= lastPage; i++) {
      arr.push(i);
    }
    setPages(arr);
  }, [lastPage]);

  const handleClick = (num: number) => {
    setPage(num);
  };

  if (!pages) return null;

  const filteredPages = pages
    .filter((p) => {
      if (p === 1 || p === lastPage) return true;
      if (page <= delta - 1) return p <= delta;
      if (page > lastPage - (delta - 1)) return p >= lastPage - (delta - 1);
      return Math.abs(page - p) <= delta / 2;
    })
    .reduce<JSX.Element[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) {
        acc.push(
          <span className={styles.dots} key={`dots-${idx}`}>
            ...
          </span>
        );
      }

      acc.push(
        <button key={p} className={`${styles.page} button ${p === page ? styles.page__chosen : ''}`} onClick={() => handleClick(p)} disabled={p === page}>
          {p}
        </button>
      );

      return acc;
    }, []);

  const toggleNextPage = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };
  const togglePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {lastPage > 1 && (
        <button onClick={() => togglePrev()} className={`${styles.arrow} button`}>
          <img src="/icons/arrow-left.svg" />
        </button>
      )}

      {filteredPages}
      {lastPage > 1 && (
        <button onClick={() => toggleNextPage()} className={`${styles.arrow} button`}>
          <img src="/icons/arrow-right.svg" />
        </button>
      )}
    </div>
  );
}
