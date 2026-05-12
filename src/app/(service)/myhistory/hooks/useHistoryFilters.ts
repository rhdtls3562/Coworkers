/**
 * 마이 히스토리 상단 필터 버튼의 활성 상태를 관리하는 훅입니다.
 */

import { useState } from 'react';

export default function useHistoryFilters() {
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  const handleSelectFilter = (filterId: string) => {
    setActiveFilterId((prev) => (prev === filterId ? null : filterId));
  };

  return {
    activeFilterId,
    handleSelectFilter,
  } as const;
}
