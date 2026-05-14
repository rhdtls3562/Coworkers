import type { ReactNode } from 'react';

export type ModalFrameProps = {
  children?: ReactNode;
  bodyClassName?: string;
  hasIcon?: boolean;
  hasCloseButton?: boolean;
  title?: string;
  subTitle?: string;
  description?: string;
  subDescription?: string;
  onClose: () => void;
  overlayClassName?: string;
  lineButtonText?: string;
  onLineButtonClick?: () => void;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  isPrimaryButtonDisabled?: boolean;
  subButtonText?: string;
  onSubButtonClick?: () => void;
  isButtonAlign?: boolean;
};
