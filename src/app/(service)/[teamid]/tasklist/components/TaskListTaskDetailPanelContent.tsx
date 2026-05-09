'use client';

import TaskListTaskDetailCommentInput from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDetailCommentInput';
import TaskListTaskDetailCommentItem from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDetailCommentItem';
import TaskListTaskDetailMeta from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDetailMeta';
import type {
  TaskListBoardTask,
  TaskListTaskComment,
} from '@/app/(service)/[teamid]/tasklist/types';
import { IcMoreVerticalSmall } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import { ContentTextarea, TitleInput } from '@/components/common/form';

type TaskListTaskDetailPanelContentProps = {
  comments: TaskListTaskComment[];
  currentUserImage: string | null;
  currentUserName: string;
  description: string;
  draftCommentContent: string;
  draftDescription: string;
  draftTitle: string;
  editingCommentId: string | null;
  isTaskEditing: boolean;
  onCancelCommentEdit: () => void;
  onChangeDraftContent: (value: string) => void;
  onCreateComment: (content: string) => void;
  onDeleteComment: (id: string) => void;
  onStartCommentEdit: (comment: TaskListTaskComment) => void;
  onSubmitCommentEdit: () => void;
  onDeleteFromPanel: () => void;
  onStartTaskEdit: () => void;
  setDraftDescription: (value: string) => void;
  setDraftTitle: (value: string) => void;
  task: TaskListBoardTask;
  title: string;
};

export default function TaskListTaskDetailPanelContent({
  comments,
  currentUserImage,
  currentUserName,
  description,
  draftCommentContent,
  draftDescription,
  draftTitle,
  editingCommentId,
  isTaskEditing,
  onCancelCommentEdit,
  onChangeDraftContent,
  onCreateComment,
  onDeleteComment,
  onStartCommentEdit,
  onSubmitCommentEdit,
  onDeleteFromPanel,
  onStartTaskEdit,
  setDraftDescription,
  setDraftTitle,
  task,
  title,
}: TaskListTaskDetailPanelContentProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-8 md:px-8 md:pb-40 md:pt-10">
      {isTaskEditing ? (
        <TitleInput
          value={draftTitle}
          placeholder="제목을 입력해주세요."
          onChange={(event) => {
            setDraftTitle(event.target.value);
          }}
        />
      ) : (
        <div className="flex items-start justify-between gap-4">
          <h2
            id="task-list-detail-title"
            className="min-w-0 flex-1 text-xl font-bold text-text-primary md:text-2xl"
          >
            {title}
          </h2>

          <ListDropdown
            className="shrink-0"
            items={[
              { label: '수정하기', onClick: onStartTaskEdit },
              { label: '삭제하기', onClick: onDeleteFromPanel },
            ]}
            trigger={
              <>
                <span className="sr-only">{`${title} 더보기`}</span>
                <span
                  className="flex size-6 items-center justify-center"
                  aria-hidden="true"
                >
                  <IcMoreVerticalSmall
                    width={20}
                    height={20}
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>
              </>
            }
          />
        </div>
      )}

      <div className="mt-5 md:mt-6">
        <TaskListTaskDetailMeta
          assigneeImage={currentUserImage}
          assigneeName={task.assigneeName}
          frequency={task.repeatLabel}
          startedAtLabel={task.startedAtLabel}
        />
      </div>

      <div className="mt-6 border-t border-background-tertiary pt-6 md:mt-7 md:pt-7">
        {isTaskEditing ? (
          <ContentTextarea
            value={draftDescription}
            placeholder="내용을 입력하세요."
            className="min-h-24 md:min-h-28"
            onChange={(event) => {
              setDraftDescription(event.target.value);
            }}
          />
        ) : (
          <p className="text-sm font-medium leading-6 text-text-secondary md:text-base">
            {description}
          </p>
        )}

        <section className="mt-8 md:mt-9">
          <h3 className="text-lg font-bold text-text-primary md:text-xl">
            댓글 <span className="text-brand-primary">{comments.length}</span>
          </h3>

          <div className="mt-4">
            <TaskListTaskDetailCommentInput
              userImage={currentUserImage}
              onSubmit={onCreateComment}
            />
          </div>

          <ul className="mt-5 divide-y divide-background-tertiary">
            {comments.map((comment) => (
              <TaskListTaskDetailCommentItem
                key={comment.id}
                comment={comment}
                currentUserName={currentUserName}
                draftContent={draftCommentContent}
                isEditing={editingCommentId === comment.id}
                onCancelEdit={onCancelCommentEdit}
                onChangeDraftContent={onChangeDraftContent}
                onDelete={() => {
                  onDeleteComment(comment.id);
                }}
                onStartEdit={() => {
                  onStartCommentEdit(comment);
                }}
                onSubmitEdit={onSubmitCommentEdit}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
