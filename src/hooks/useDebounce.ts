/**
 * 값이 변경된 후 일정 시간이 지나야 업데이트되는 debounce 훅입니다.
 * 검색 입력처럼 빈번한 상태 변경을 지연 처리할 때 사용합니다.
 */

import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
