// clear canvas before next iteration paint
export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0, canvas.height);
};
