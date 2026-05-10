// ========================
// 공통 / 유틸리티 타입
// ========================

import type { ReactNode } from 'react';

/** 모달 키 식별자 - 열려있는 모달 종류를 구분 */
export type ModalKey =
  | 'memberList'
  | 'memberInvite'
  | 'memberDetail'
  | 'memberDelete'
  | 'taskAdd'
  | 'taskEdit'
  | 'taskDelete'
  | 'teamDelete'
  | 'teamLeave';

/** 모달 열기 함수 타입 */
export type OpenModal = (modal: ModalKey) => void;

/** 사용자 역할 - 관리자 또는 일반 멤버 */
export type RoleProps = 'ADMIN' | 'MEMBER';

/** 태스크 반복 주기 */
export type Frequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

/** 태스크 관련 모달 Props */
export type ModalTaskProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  initialTitle?: string;
  taskListId?: number;
};

/** 확인(Confirm) 모달 Props - 삭제/탈퇴 등 위험 액션 확인용 */
export type ConfirmModalProps = {
  title?: string;
  description?: string;
  confirmText: string;
  toastMessage: string;
  onClose: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
};
