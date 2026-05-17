/** 폼 컴포넌트 TypeScript 타입 정의 파일입니다. */

import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  errorMessage?: string;
};

export type TitleInputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
};

export type ContentTextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    errorMessage?: string;
    button?: ReactNode;
  };

export type CommentInputProps = {
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSubmit?: (value: string) => void;
};

type DatePickerCommonProps = {
  id?: string;
  isInline?: boolean;
  maxDate?: Date;
  minDate?: Date;
  openToDate?: Date;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
};

export type DatePickerRangeValue = [Date | null, Date | null];

export type ImageUploadFieldVariant = 'post' | 'profile';

export type ImageCropShape = 'round' | 'rect';

export type ImageUploadFieldProps = {
  buttonAriaLabel: string;
  cropShape?: ImageCropShape;
  disabled?: boolean;
  id?: string;
  onChangeFile?: (file: File | null) => void;
  previewAlt: string;
  src?: string | null;
  variant: ImageUploadFieldVariant;
};

export type SingleDatePickerProps = DatePickerCommonProps & {
  onChange: (date: Date | null) => void;
  selected: Date | null;
  selectsRange?: false;
};

export type RangeDatePickerProps = DatePickerCommonProps & {
  endDate: Date | null;
  onChange: (date: DatePickerRangeValue) => void;
  selectsRange: true;
  startDate: Date | null;
};

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;
