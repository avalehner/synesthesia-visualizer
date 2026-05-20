import type { HelixSegment } from '../types';
import { months } from './monthsConfig';

export const helix: HelixSegment[] = [];
const currentYear = new Date().getFullYear();
export const totalYears = currentYear - 1998;
const totalMonths = 12 * (currentYear - 1998);
const yearFromIndex = (i: number) => {
  return Math.floor(i / 12) + 1999;
};

const generateHelixSegments = () => {
  for (let i = 0; i < totalMonths; i++) {
    const currentMonthIndex = i % 12;
    helix.push({
      index: i,
      label: `${months[currentMonthIndex].shortName} ${yearFromIndex(i)}`,
      color: months[currentMonthIndex].color,
      year: yearFromIndex(i),
      month: months[currentMonthIndex].name,
    });
  }
};

generateHelixSegments();
