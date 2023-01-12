import { WIDTH_DPI, HEIGHT_DPI, PADDING } from 'src/const/chart';
import type { NormalizeDataReturn } from 'src/utils/normalizeData/normalizeData';

// return ratio real value with coordinate x on canvas
export const getRatio = (
  data: NormalizeDataReturn,
  height = HEIGHT_DPI,
  padding = PADDING
) => Number(((height - padding * 2) / (data.max - data.min)).toFixed(5));

export const getXCoord = (
  val: number,
  data: NormalizeDataReturn,
  ratio: number,
  padding = PADDING
) => (val - data.min) * ratio + padding;

export const getYCoord = (data: NormalizeDataReturn, width = WIDTH_DPI) => {
  return (width + width / data.days.length) / data.days.length;
};

// paint data in char
export const paintCoords = (
  ctx: CanvasRenderingContext2D,
  data: NormalizeDataReturn
) => {
  const ratio = getRatio(data);

  ctx.rotate(-Math.PI / 2);

  ctx.beginPath();
  ctx.strokeStyle = '#000';
  let y = 0;

  for (const val of data.days) {
    const x = getXCoord(val, data, ratio);

    ctx.lineTo(x, y);
    y += getYCoord(data);
  }

  ctx.stroke();
  ctx.closePath();
};
