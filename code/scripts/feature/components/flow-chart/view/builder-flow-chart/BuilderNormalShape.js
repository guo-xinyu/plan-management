class BuilderNormalShape {
  drawLine(startPosition, endPosition, lineWidth, lineDash, color, ctx) {
    var path = new Path2D();
    path.moveTo(startPosition[0], startPosition[1]);
    path.lineTo(endPosition[0], endPosition[1]);

    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(lineDash);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.stroke(path);
    ctx.restore();
  }

  drawText(text, position, color, font, baseLine, textAlign, ctx) {
    ctx.save();
    ctx.textBaseline = baseLine;
    ctx.textAlign = textAlign;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, position[0], position[1]);
    ctx.restore();
  }
}

export { BuilderNormalShape };
