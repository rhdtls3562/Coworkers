/**
 * 할 일 보드(월·주 선택)용 날짜 유틸입니다.
 */

/** 0=일 … 6=토 (반복 요일 UI 등) */
export const TASKLIST_WEEKDAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
] as const;

const MONTH_PAD_LENGTH = 2;
const DAY_PAD_LENGTH = 2;

function padMonth(month: number) {
  return String(month).padStart(MONTH_PAD_LENGTH, '0');
}

function padDay(day: number) {
  return String(day).padStart(DAY_PAD_LENGTH, '0');
}

export function addDays(date: Date, dayCount: number): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + dayCount);
  return next;
}

export function addMonths(date: Date, monthCount: number): Date {
  const next = new Date(date);
  next.setMonth(date.getMonth() + monthCount);
  return next;
}

export function getMonthStart(date: Date, monthOffset = 0): Date {
  const base = addMonths(date, monthOffset);
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

export function formatYearMonth(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatTaskListTitleDate(date: Date): string {
  if (date.getDate() === 1) {
    return `${date.getFullYear()}.${padMonth(date.getMonth() + 1)}`;
  }

  return `${date.getFullYear()}.${padMonth(date.getMonth() + 1)}.${padDay(date.getDate())}`;
}

/** 예: 2024년 11월 14일 */
export function formatFullKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 24h "HH:mm" → 오전/오후 h:mm */
export function formatKoreanMeridiemTime(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const isPm = h >= 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${isPm ? '오후' : '오전'} ${h12}:${String(m).padStart(2, '0')}`;
}

/** 월요일 시작 주의 월요일 00:00 */
export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function formatWeekdayLabel(date: Date): string {
  return TASKLIST_WEEKDAY_LABELS[date.getDay()] ?? '';
}

/** 반복 요일 선택 시 마지막 요일 해제 방지 */
export function canRemoveWeekday(
  selectedDays: number[],
  dayIndex: number,
): boolean {
  return !(selectedDays.includes(dayIndex) && selectedDays.length === 1);
}
