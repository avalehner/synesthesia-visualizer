export type TimeSegment = {
  index: number;
  label: string;
  color: string;
};

export type HelixSegment = TimeSegment & {
  year?: number;
  month?: string;
};

export type Month = {
  name: string;
  shortName: string;
  index: number;
  color: string;
};
