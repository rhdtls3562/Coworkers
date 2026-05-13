/**
 * 할 일 목록 컬럼(제목·목록·추가 버튼)입니다.
 * lg 미만: 드롭다운과 추가 버튼을 한 줄(justify-between). 모바일 180×44 드롭다운.
 * lg 이상: 카드 목록 + 143×40 추가 버튼.
 */

import TaskListColumnDropdown from '@/app/(service)/[teamid]/tasklist/components/TaskListColumnDropdown';
import TaskListEmptyColumnPlaceholder from '@/app/(service)/[teamid]/tasklist/components/TaskListEmptyColumnPlaceholder';
import TaskListNavItem from '@/app/(service)/[teamid]/tasklist/components/TaskListNavItem';
import {
  TASK_LIST_ADD_LIST_BUTTON_DESKTOP_CLASS,
  TASK_LIST_ADD_LIST_BUTTON_MOBILE_CLASS,
} from '@/app/(service)/[teamid]/tasklist/constants/taskListSidebarConstants';
import type {
  TaskListSidebarPlusIconProps,
  TaskListSidebarProps,
} from '@/app/(service)/[teamid]/tasklist/types';
import { cn } from '@/utils/cn';

/** 16×16, stroke = currentColor (brand) */
function AddTaskListPlusIcon({ className }: TaskListSidebarPlusIconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path
        d="M4 8H12.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M8.25 12.25V3.75"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TaskListSidebar({
  className,
  columns,
  activeId,
  onSelectColumn,
  onRequestRenameColumn,
  onRequestDeleteColumn,
  onAddListClick,
}: TaskListSidebarProps) {
  const isColumnListEmpty = columns.length === 0;

  return (
    <section
      className={cn(
        'flex w-full min-w-0 max-w-full flex-col lg:max-w-67.5 lg:shrink-0',
        className,
      )}
      aria-label="할 일 목록"
    >
      <div className="flex flex-col lg:hidden">
        <p className="text-sm font-normal leading-5 text-text-default">할 일</p>
        <div className="mt-2 flex min-w-0 w-full flex-row items-center justify-between gap-2">
          {isColumnListEmpty ? (
            <TaskListEmptyColumnPlaceholder />
          ) : (
            <TaskListColumnDropdown
              items={columns}
              activeId={activeId}
              onSelect={onSelectColumn}
              className="min-w-0 shrink-0"
            />
          )}
          <button
            type="button"
            className={TASK_LIST_ADD_LIST_BUTTON_MOBILE_CLASS}
            onClick={onAddListClick}
          >
            <span className="inline-flex items-center justify-center gap-1">
              <AddTaskListPlusIcon className="size-4" />
              <span className="whitespace-nowrap">할 일 목록 추가</span>
            </span>
          </button>
        </div>
      </div>

      <div className="hidden w-full min-w-0 flex-col lg:flex">
        <h2 className="text-lg font-bold leading-6 text-text-primary md:text-xl">
          할 일 목록
        </h2>
        <ul className="m-0 mt-4 flex w-full list-none flex-col gap-2 p-0 md:mt-6">
          {isColumnListEmpty ? (
            <li className="list-none">
              <TaskListEmptyColumnPlaceholder />
            </li>
          ) : (
            columns.map((item) => (
              <TaskListNavItem
                key={item.id}
                item={item}
                isActive={item.id === activeId}
                onRequestRename={onRequestRenameColumn}
                onSelect={() => onSelectColumn(item.id)}
                onRequestDelete={onRequestDeleteColumn}
              />
            ))
          )}
        </ul>
        <button
          type="button"
          className={TASK_LIST_ADD_LIST_BUTTON_DESKTOP_CLASS}
          onClick={onAddListClick}
        >
          <span className="inline-flex items-center justify-center gap-1">
            <AddTaskListPlusIcon className="size-4" />
            <span className="whitespace-nowrap">할 일 목록 추가</span>
          </span>
        </button>
      </div>
    </section>
  );
}
