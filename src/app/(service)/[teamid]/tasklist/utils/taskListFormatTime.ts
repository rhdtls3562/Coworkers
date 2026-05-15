import { KST_TIME_FORMAT } from '@/app/(service)/[teamid]/tasklist/constants/taskListTask';
export function formatKSTTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return KST_TIME_FORMAT.format(date);
}
