/**
 * 큰 화면에서 노출되는 내가 한 일 요약 목록을 렌더링하는 컴포넌트입니다.
 */

'use client';

import type { MyHistorySummaryProps } from '@/app/(service)/myhistory/types';
import { cn } from '@/utils/cn';

export default function MyHistorySummary({
  activeItemId,
  items,
  onSelectItem,
}: MyHistorySummaryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden w-76 shrink-0 2xl:block">
      <h2 className="text-xl font-bold text-text-primary">내가 한 일</h2>

      <div className="mt-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-5">
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const isActive = activeItemId === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={isActive}
                  onClick={() => onSelectItem(item.id)}
                  className={cn(
                    'flex h-13.5 w-67.5 items-center justify-between rounded-xl border px-5 text-base',
                    isActive
                      ? 'border-brand-primary bg-brand-primary text-text-inverse'
                      : 'border-background-tertiary bg-background-inverse text-text-primary',
                  )}
                >
                  <span className="font-semibold">{item.title}</span>
                  <span
                    className={
                      isActive
                        ? 'font-semibold text-text-inverse'
                        : 'font-semibold text-brand-primary'
                    }
                  >
                    {item.countText}
                  </span>
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-out',
                    isActive ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="w-67.5 rounded-xl border border-background-tertiary bg-background-inverse py-3">
                      {item.details.map((detail) => (
                        <li
                          key={detail.id}
                          className="flex items-center justify-between px-5 py-1.5 text-sm font-medium text-text-primary"
                        >
                          <span>{detail.title}</span>
                          <span className="text-brand-primary">
                            {detail.countText}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
