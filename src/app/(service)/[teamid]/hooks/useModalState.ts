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
    setSelectedMember(null); // 닫을 때 초기화
  };
  const openMemberDetail = (member: MemberChipsProps) => {
    setSelectedMember(member);
    setOpenModal('memberDetail');
  };

  const handleInvite = () => setOpenModal('memberInvite');

  return {
    openModal,
    selectedMember,
    open,
    close,
    openMemberDetail,
    handleInvite,
    is: (key: ModalKey) => openModal === key,
  };
}
