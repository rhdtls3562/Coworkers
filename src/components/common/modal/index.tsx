/** 모달 컴포넌트를 조합해 export하는 파일입니다. */

import ModalFrame from '@/components/common/modal/components/ModalFrame';
import ModalPortal from '@/components/common/modal/components/ModalPortal';

import type { ModalFrameProps } from './types';

export { default as TaskDeleteConfirmModal } from '@/components/common/modal/components/TaskDeleteConfirmModal';

export default function Modal(props: ModalFrameProps) {
  return (
    <ModalPortal>
      <ModalFrame {...props} />
    </ModalPortal>
  );
}
