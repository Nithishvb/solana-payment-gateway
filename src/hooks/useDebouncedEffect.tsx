import { useEffect } from 'react';

export const useDebouncedEffect = (
  callback: () => void,
  delay: number,
  dependencies: unknown[]
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies]);
};
