import { getRatio, getXCoord, getYCoord } from '../paintCoords';

const MOCK_DATA = {
  min: -10,
  max: 20,
  days: [-20, -10, 0, 15, 20],
};
const HEIGHT = 600;
const PADDING = 30;
const WIDTH = 1200;

describe('getRatio', () => {
  it('should return the ratio', () => {
    expect(getRatio(MOCK_DATA, HEIGHT, PADDING)).toBe(18);
  });
});

describe('getXCoord', () => {
  it('should return the x coord', () => {
    expect(
      getXCoord(-10, MOCK_DATA, getRatio(MOCK_DATA, HEIGHT, PADDING))
    ).toBe(30);
  });
});

describe('getYCoord', () => {
  it('should return the y coord', () => {
    expect(getYCoord(MOCK_DATA, WIDTH)).toBe(288);
  });
});
