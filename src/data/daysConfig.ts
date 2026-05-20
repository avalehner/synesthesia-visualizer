import { months } from './monthsConfig';
import type { TimeSegment } from '../types';

export const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysOfWeek = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
export const days: TimeSegment[] = [];
let dayIndex = 0;

for (let i = 0; i < 12; i++) {
  const monthIndex = i;
  const daysInMonth = daysPerMonth[monthIndex];
  for (let j = 0; j < daysInMonth; j++) {
    days.push({
      index: dayIndex,
      label: daysOfWeek[dayIndex % 7],
      color: months[monthIndex].color,
    });
    dayIndex++;
  }
}
