/**
 * 할 일 만들기 시간 선택 팝오버의 파싱 유틸입니다.
 */

export function getTaskListTimeParts(time: string) {
  const [hour = '00', minute = '00'] = time.split(':');

  return {
    hour: hour.padStart(2, '0'),
    minute: minute.padStart(2, '0'),
  };
}
