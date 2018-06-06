// import { DecoratorCanvasRenderingContext2D } from '../decorator/DecoratorCanvasRenderingContext2D.js';

class ConcreteBuilderView {
  constructor(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error();
    }
    this._ctx = ctx;
  }
  _drawText(text, position, color, fontSize, fontFamily, baseLine, textAlign, ctx) {
    const font = `${fontSize}px ${fontFamily}`;
    const cut2Lines = text.split('\n');
    ctx.save();
    ctx.textBaseline = baseLine;
    ctx.textAlign = textAlign;
    ctx.font = font;
    ctx.fillStyle = color;
    for (let [index, singleLine] of cut2Lines.entries()) {
      ctx.fillText(singleLine, position[0], position[1] - ((cut2Lines.length - index - 1) * fontSize));
    }
    ctx.restore();
  }
  _drawBorder(path, lineWidth, lineStyle, strokeColor, ctx) {
    let lineDash = [];
    switch (lineStyle) {
      case 'solid':
        lineDash.push(0, 0);
        break;
      case 'dashed':
        lineDash.push(lineWidth, lineWidth);
        break;
      default:
        break;
    }
    ctx.save();
    // if (strokeColor) {
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(lineDash);
    ctx.strokeStyle = strokeColor;
    ctx.stroke(path);
    // }
    ctx.restore();
  }
  _drawInner(path, fillColor, ctx) {
    ctx.save();
    // if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill(path);
    // }
    ctx.restore();
  }
  _createTextView(textDesign) {
    switch (textDesign.foulLineDirection) {
      case 'left':
        this._drawText(textDesign.text, textDesign.basePoint, textDesign.color, textDesign.fontSize,
          textDesign.fontFamily, 'middle', 'left', this._ctx);
        break;
      case 'bottom':
        this._drawText(textDesign.text, textDesign.basePoint, textDesign.color, textDesign.fontSize,
          textDesign.fontFamily, 'bottom', 'center', this._ctx);
        break;
      default:
        break;
    }
  }
  _createPatternView(patternDesign) {
    const border = patternDesign.border;
    const color = patternDesign.color;
    if (color && color.stroke) {
      this._drawBorder(border.path, border.width, border.style, color.stroke, this._ctx);
    }
    if (color && color.fill) {
      this._drawInner(border.path, color.fill, this._ctx);
    }
  }
  _createViewBaseDesign(design) {
    for (let section of design.patternDesign) {
      this._createPatternView(section);
    }
    for (let section of design.textDesign) {
      // console.log(section);
      this._createTextView(section);
    }
  }
  buildView(viewData) {
    for (let refer of viewData.refer) {
      this._createViewBaseDesign(refer);
    }
    this._createViewBaseDesign(viewData.self);
  }
}

export { ConcreteBuilderView };
