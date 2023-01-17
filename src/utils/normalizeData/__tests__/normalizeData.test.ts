import {
  getRangeDays,
  getSizeStep,
  isSmallData,
  normalizeData,
} from '../normalizeData';

const PADDING_COORDS = 20;
const WIDTH_DPI = 1200;

const MOCK_DAT_MAP = new Map<number, number[]>([
  ...new Array(1000)
    .fill(0)
    .map<[number, number[]]>((item, i) => [i + 1, [i + 1]]),
]);

describe('getSizeStep', () => {
  it('should return size step === 3', () => {
    expect(getSizeStep(200000)).toBe(547);
  });

  it('should return size step === 1', () => {
    expect(getSizeStep(2)).toBe(1);
  });
});

describe('normalizeData', () => {
  it('should return min === 2', () => {
    expect(
      normalizeData({ startYear: 2, endYear: 600, dataMap: MOCK_DAT_MAP }).min
    ).toBe(2);
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
