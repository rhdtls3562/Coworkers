import type { TaskDetailCommentActionsProps } from '@/components/common/rightPanel/types';

export default function TaskDetailCommentActions({
  isPrimaryDisabled = false,
  onCancel,
  onPrimaryAction,
  primaryLabel,
}: TaskDetailCommentActionsProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-3 text-sm font-medium text-text-default">
      <button
        data-allow-unsaved="true"
        type="button"
        className="text-text-default"
        onClick={onCancel}
      >
        취소
      </button>
      <button
        data-allow-unsaved="true"
        type="button"
        disabled={isPrimaryDisabled}
        className="h-8 rounded-lg border border-brand-primary px-3 text-brand-primary disabled:border-interaction-inactive disabled:text-interaction-inactive"
        onClick={onPrimaryAction}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
