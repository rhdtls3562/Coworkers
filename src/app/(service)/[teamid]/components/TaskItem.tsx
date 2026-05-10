import { useState } from 'react';

import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalTaskEdit } from '@/app/(service)/[teamid]/components/modals/ModalTaskAddEdit';
import { DROPDOWN_BUTTON } from '@/app/(service)/[teamid]/constants';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import { TaskItemProps } from '@/app/(service)/[teamid]/types';
import { ListDropdown } from '@/components/common/dropdown';
import TodoCheckUncheck from '@/components/common/todo/TodoCheckUncheck';
import { cn } from '@/utils/cn';

export default function TaskItem({ title, status }: TaskItemProps) {
  const [todos, setTodos] = useState<
    { id: number; label: string; status: boolean }[]
  >([]);
  const { open, close, is } = useModalState();

  const DropdownItems = [
    {
      label: '수정하기',
      onClick: () => {
        open('taskEdit');
      },
    },
    {
      label: '삭제하기',
      onClick: () => {
        open('taskDelete');
      },
    },
    // TODO : 삭제 기능 추가되면 추가할 예쩡
  ];

  const handleChange = (id: number, next: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status: next } : todo)),
    );
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'bg-background-inverse p-6 pr-3 rounded-2xl border border-border-secondary flex flex-col gap-4',
          status === '완료' && 'pl-6 pr-3 py-3.5',
        )}
      >
        <div className="flex gap-3 items-center justify-center">
          <p className="flex-1 text-text-primary text-sm font-semibold whitespace-nowrap">
            {title}
          </p>
          <div className="w-6 h-6 shrink-0">
            <ListDropdown trigger={DROPDOWN_BUTTON} items={DropdownItems} />
          </div>
        </div>
        {status !== '완료' && (
          <div className="flex flex-col gap-3 pr-2 w-full">
            {todos.length > 0 ? (
              todos
                .slice(0, 3)
                .map((todo) => (
                  <TodoCheckUncheck
                    key={todo.id}
                    label={todo.label}
                    checked={todo.status}
                    onChange={(next) => handleChange(todo.id, next)}
                  />
                ))
            ) : (
              <p className="text-sm font-normal text-text-default">
                아직 체크리스트가 없어요.
              </p>
            )}
          </div>
        )}
      </div>

      {is('taskEdit') && <ModalTaskEdit onClose={close} />}
      {is('taskDelete') && (
        <ConfirmModal
          onClose={close}
          title="해당 할 일 목록을 삭제하시겠습니까?"
          confirmText="삭제"
          toastMessage="삭제 되었습니다."
        />
      )}
    </div>
  );
}
