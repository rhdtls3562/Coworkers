import CommentWriterAvatar from '@/app/(service)/boards/[articleId]/components/CommentWriterAvatar';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { IcMoreVerticalLarge } from '@/assets';
import ListDropdown from '@/components/common/dropdown/components/ListDropdown';
import Modal from '@/components/common/modal';

type CommentMenuItem = {
  label: string;
  onClick: () => void;
};

type CommentReadonlyContentProps = {
  comment: Comment;
  menuItems: CommentMenuItem[];
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onDeleteConfirm: () => void;
};

export default function CommentReadonlyContent({
  comment,
  menuItems,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onDeleteConfirm,
}: CommentReadonlyContentProps) {
  return (
    <li className="flex gap-4 border-t border-background-tertiary py-3 md:py-5">
      <CommentWriterAvatar
        image={comment.writer.image}
        nickname={comment.writer.nickname}
      />
      <div className="flex w-full justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-bold text-text-primary">
            {comment.writer.nickname}
          </p>
          <p className="line-clamp-1 text-sm font-normal text-text-primary">
            {comment.content}
          </p>
          <p className="text-sm font-medium text-interaction-inactive">
            {comment.createdAt}
          </p>
        </div>
        <div className="shrink-0">
          <ListDropdown
            trigger={
              <IcMoreVerticalLarge
                width={20}
                height={20}
                className="cursor-pointer shrink-0"
                role="img"
                aria-label="더보기 메뉴"
              />
            }
            items={menuItems}
          />
          {isDeleteModalOpen && (
            <Modal
              onClose={onCloseDeleteModal}
              title="댓글을 삭제하시겠습니까?"
              description="댓글 정보가 삭제됩니다."
              lineButtonText="닫기"
              onLineButtonClick={onCloseDeleteModal}
              subButtonText="삭제"
              onSubButtonClick={onDeleteConfirm}
            />
          )}
        </div>
      </div>
    </li>
  );
}
