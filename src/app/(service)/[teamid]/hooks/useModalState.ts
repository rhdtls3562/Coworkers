/** 팀 페이지 모달 열림/닫힘 상태를 관리하는 훅입니다. */

import { useState } from 'react';

import { MemberChipsProps, ModalKey } from '@/app/(service)/[teamid]/types';

export function useModalState() {
  const [openModal, setOpenModal] = useState<ModalKey | null>(null);

  const [selectedMember, setSelectedMember] = useState<MemberChipsProps | null>(
    null,
  ); // 선택한.. 멤버 상태 추가

  const open = (key: ModalKey) => setOpenModal(key);
  const close = () => {
    setOpenModal(null);
  };
  const openMemberDetail = (member: MemberChipsProps) => {
    setSelectedMember(member);
    setOpenModal('memberDetail');
  };
  const reset = () => {
    setOpenModal(null);
    setSelectedMember(null);
  };
  const handleInvite = () => setOpenModal('memberInvite');

  return {
    openModal,
    selectedMember,
    open,
    close,
    openMemberDetail,
    reset,
    handleInvite,
    is: (key: ModalKey) => openModal === key,
  };
}
