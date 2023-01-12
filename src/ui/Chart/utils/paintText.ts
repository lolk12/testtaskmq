import { HEIGHT_DPI, WIDTH_DPI, PADDING } from 'src/const/chart';

// paint min and max values
export const paintText = (
  ctx: CanvasRenderingContext2D,
  min: number,
  max: number
) => {
  const paint = (x: number, xText: number, text: string) => {
    ctx.beginPath();
    ctx.save();
    ctx.moveTo(x, 0);
    ctx.setLineDash([10, 15]);
    ctx.lineTo(x, WIDTH_DPI);
    ctx.font = '18px Arial';
    ctx.resetTransform();
    ctx.fillText(text, 10, xText);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();
  };

  paint(PADDING, PADDING - PADDING / 2.5, String(max));
  paint(HEIGHT_DPI - PADDING, HEIGHT_DPI - PADDING / 2.5, String(min));
};
