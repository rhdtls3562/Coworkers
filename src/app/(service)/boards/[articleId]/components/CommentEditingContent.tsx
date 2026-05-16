import CommentWriterAvatar from '@/app/(service)/boards/[articleId]/components/CommentWriterAvatar';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { COMMENT_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

type CommentEditingContentProps = {
  comment: Comment;
  editedContent: string;
  onChangeEditedContent: (content: string) => void;
  onCancelEdit: () => void;
  onEdit: () => void;
};

export default function CommentEditingContent({
  comment,
  editedContent,
  onChangeEditedContent,
  onCancelEdit,
  onEdit,
}: CommentEditingContentProps) {
  const isCommentAtLimit = editedContent.length >= COMMENT_TEXT_LIMIT;

  return (
    <li className="flex min-w-0 w-full pb-3 md:pb-5">
      <div className="flex min-w-0 w-full gap-4 bg-background-secondary px-2.5 py-2.5 lg:px-3.75 lg:py-3.75">
        <CommentWriterAvatar
          image={comment.writer.image}
          nickname={comment.writer.nickname}
        />
        <div className="min-w-0 w-full">
          <p className="text-sm font-bold text-text-primary">
            {comment.writer.nickname}
          </p>
          <textarea
            className="mt-1 min-h-18 min-w-0 w-full resize-none overflow-hidden wrap-anywhere rounded-xl border border-background-tertiary bg-background-primary px-4 py-3 text-sm font-medium leading-5 text-text-secondary outline-none"
            placeholder="내용을 입력하세요."
            value={editedContent}
            maxLength={COMMENT_TEXT_LIMIT}
            onChange={(event) => onChangeEditedContent(event.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {isCommentAtLimit ? (
              <p className="text-left text-sm font-medium text-status-danger">
                {COMMENT_TEXT_LIMIT}자 이내로 작성해주세요.
              </p>
            ) : (
              <span />
            )}
            <p className="text-right text-sm text-text-default">
              {editedContent.length}/{COMMENT_TEXT_LIMIT}
            </p>
          </div>
          <div className="mt-3 flex shrink-0 items-center justify-end gap-3 text-sm font-medium text-text-default">
            <button
              data-allow-unsaved="true"
              type="button"
              className="text-text-default"
              onClick={onCancelEdit}
            >
              취소
            </button>
            <button
              data-allow-unsaved="true"
              type="button"
              className="h-8 rounded-lg border border-brand-primary px-3 text-brand-primary"
              onClick={onEdit}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
