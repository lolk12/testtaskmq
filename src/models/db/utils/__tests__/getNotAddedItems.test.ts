import { MOCK_DATA_ITEMS } from '@/const/mocks';
import { getNotAddedItems } from '../getNotAddedItems';

describe('getNotAddedItems', () => {
  it('should return an empty array when no items are added', () => {
    expect(getNotAddedItems('1881-01-01', MOCK_DATA_ITEMS)[0].t).toBe(
      '1881-02-01'
    );
  });
});
