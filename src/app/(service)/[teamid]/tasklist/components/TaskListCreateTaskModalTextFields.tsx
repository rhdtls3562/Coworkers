/**
 * 할 일 생성 모달의 제목/메모 입력 필드를 묶은 컴포넌트 파일입니다.
 */

import {
  CREATE_TASK_FIELD_SHELL_CLASS,
  CREATE_TASK_MEMO_INNER_WRAPPER_CLASS,
  CREATE_TASK_MEMO_SHELL_CLASS,
  CREATE_TASK_MEMO_TEXTAREA_CLASS,
  CREATE_TASK_MODAL_COLUMN_CLASS,
  CREATE_TASK_TITLE_INPUT_INNER_CLASS,
  MODAL_HEADING_TYPO,
} from '@/app/(service)/[teamid]/tasklist/createTaskModalConstants';
import Input from '@/components/common/form/components/Input';
import { cn } from '@/utils/cn';

type TaskListCreateTaskModalTextFieldsProps = {
  formId: string;
  memo: string;
  onMemoChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  title: string;
};

export default function TaskListCreateTaskModalTextFields({
  formId,
  memo,
  onMemoChange,
  onTitleChange,
  title,
}: TaskListCreateTaskModalTextFieldsProps) {
  return (
    <>
      <div
        className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}
      >
        <label
          htmlFor={`${formId}-title`}
          className={cn(MODAL_HEADING_TYPO, 'text-left')}
        >
          할 일 제목
        </label>

        <div className={CREATE_TASK_FIELD_SHELL_CLASS}>
          <Input
            id={`${formId}-title`}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="할 일 제목을 입력해주세요."
            className={cn(CREATE_TASK_TITLE_INPUT_INNER_CLASS, 'px-4')}
          />
        </div>
      </div>

      <div
        className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}
      >
        <label
          htmlFor={`${formId}-memo`}
          className={cn(MODAL_HEADING_TYPO, 'text-left')}
        >
          할 일 메모
        </label>

        <div className={CREATE_TASK_MEMO_SHELL_CLASS}>
          <div className={CREATE_TASK_MEMO_INNER_WRAPPER_CLASS}>
            <textarea
              id={`${formId}-memo`}
              value={memo}
              onChange={(event) => onMemoChange(event.target.value)}
              placeholder="메모를 입력해주세요."
              autoComplete="off"
              className={CREATE_TASK_MEMO_TEXTAREA_CLASS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
