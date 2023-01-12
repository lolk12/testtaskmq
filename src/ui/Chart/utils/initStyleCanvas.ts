import { WIDTH, HEIGHT, WIDTH_DPI, HEIGHT_DPI } from 'src/const/chart';

// initialize styles for chart
export const initStyleCanvas = (canvas: HTMLCanvasElement) => {
  canvas.style.width = `${WIDTH}px`;
  canvas.style.height = `${HEIGHT}px`;
  canvas.width = WIDTH_DPI;
  canvas.height = HEIGHT_DPI;
};
