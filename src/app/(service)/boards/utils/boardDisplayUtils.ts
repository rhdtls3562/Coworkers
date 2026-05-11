/**
 * 게시글 표시 유틸리티 함수
 */

export const getLikeCount = (likeCount: number) => {
  return likeCount > 999 ? '999+' : likeCount.toString();
};

export const formatDateToYmd = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};
