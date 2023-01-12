import { getDataMap } from '../getDataMap';
import { MOCK_DATA_ITEMS, FIRST_YEAR, SECOND_YEAR } from './mock';

describe('getDataMap', () => {
  it('should return data in Map where key is year, value all days in year', () => {
    const result = getDataMap(MOCK_DATA_ITEMS);

    expect(String(result.get(FIRST_YEAR))).toBe('1,2,3');
    expect(String(result.get(SECOND_YEAR))).toBe('1,2');
  });
});
