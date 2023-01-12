import { PADDING_COORDS, WIDTH_DPI } from 'src/const/chart';

import { getSizeStep, getRangeDays, isSmallData, normalizeData } from '../normalizeData';

const MOCK_DAT_MAP = new Map<number, number[]>([
  ...new Array(1000).fill(0).map<[number, number[]]>((item, i) => [i + 1, [i + 1]]),
]);

describe('getSizeStep', () => {
  it('should return size step === 3', () => {
    expect(getSizeStep(200, WIDTH_DPI, PADDING_COORDS)).toBe(3);
  });

  it('should return size step === 1', () => {
    expect(getSizeStep(2, WIDTH_DPI, PADDING_COORDS)).toBe(1);
  });
});

describe('normalizeData', () => {
  it('should return min === 2', () => {
    expect(normalizeData({ startYear: 2, endYear: 600, dataMap: MOCK_DAT_MAP }).min).toBe(6);
  });
});

describe('isSmallData', () => {
  it('should return false', () => {
    expect(isSmallData(10, 5)).toBe(false);
  });
  it('should return true', () => {
    expect(isSmallData(2, 5)).toBe(true);
  });
});

describe('getRangeDays', () => {
  it('should return array days with 2,3', () => {
    expect(String(getRangeDays(MOCK_DAT_MAP, 2, 3))).toBe('2,3');
  });
  it('should return empty array', () => {
    expect(String(getRangeDays(MOCK_DAT_MAP, 3, 1))).toBe('');
  });
});
