import { getRangeDefaultYears } from '../getRangeDefaultYears';
import { MOCK_DATA_ITEMS, FIRST_YEAR, SECOND_YEAR } from '@/const/mocks';

describe('getRangeDefaultYears', () => {
  it('should return the default years', () => {
    const result = getRangeDefaultYears(MOCK_DATA_ITEMS);
    expect(result).toEqual({ endYear: SECOND_YEAR, startYear: FIRST_YEAR });
  });
});
