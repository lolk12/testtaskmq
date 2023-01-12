import { getDataForSelect } from '../getDataForSelect';

describe('getDataForSelect', () => {
  it('should return array [1,2,3]', () => {
    expect(String(getDataForSelect(1, 3))).toBe('1,2,3');
  });
});
