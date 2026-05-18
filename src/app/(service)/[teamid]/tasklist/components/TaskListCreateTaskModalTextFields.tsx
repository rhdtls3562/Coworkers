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
} from '@/app/(service)/[teamid]/tasklist/constants/createTaskModalConstants';
import type { TaskListCreateTaskModalTextFieldsProps } from '@/app/(service)/[teamid]/tasklist/types';
import Input from '@/components/common/form/components/Input';
import { MEMO_TEXT_LIMIT, TITLE_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';
import { cn } from '@/utils/cn';

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
        <div className="flex flex-col gap-2">
          <div className={CREATE_TASK_FIELD_SHELL_CLASS}>
            <Input
              id={`${formId}-title`}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="할 일 제목을 입력해주세요."
              maxLength={TITLE_TEXT_LIMIT}
              className={cn(CREATE_TASK_TITLE_INPUT_INNER_CLASS, 'px-4')}
            />
          </div>
          <div className="flex items-center justify-between">
            {title.length >= TITLE_TEXT_LIMIT ? (
              <p className="text-sm font-medium text-status-danger">
                {TITLE_TEXT_LIMIT}자 이내로 작성해주세요.
              </p>
            ) : (
              <span />
            )}
            <p className="text-right text-sm text-text-default">
              {title.length}/{TITLE_TEXT_LIMIT}
            </p>
          </div>
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

        <div className="flex flex-col gap-2">
          <div className={CREATE_TASK_MEMO_SHELL_CLASS}>
            <div className={CREATE_TASK_MEMO_INNER_WRAPPER_CLASS}>
              <textarea
                id={`${formId}-memo`}
                name="memo"
                value={memo}
                onChange={(event) => onMemoChange(event.target.value)}
                placeholder="메모를 입력해주세요."
                autoComplete="off"
                maxLength={MEMO_TEXT_LIMIT}
                className={CREATE_TASK_MEMO_TEXTAREA_CLASS}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            {memo.length >= MEMO_TEXT_LIMIT ? (
              <p className="text-sm font-medium text-status-danger">
                {MEMO_TEXT_LIMIT}자 이내로 작성해주세요.
              </p>
            ) : (
              <span />
            )}
            <p className="text-right text-sm text-text-default">
              {memo.length}/{MEMO_TEXT_LIMIT}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
