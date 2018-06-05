import { DecoratorCanvasRenderingContext2D } from '../decorator/DecoratorCanvasRenderingContext2D.js';

class ConcreteCreatorView {
  constructor(ctx) {
    if (!(ctx instanceof DecoratorCanvasRenderingContext2D)) {
      throw new Error();
    }
    this._ctx = ctx;
  }
  _drawText(text, position, color, font, baseLine, textAlign, ctx) {
    ctx.save();
    ctx.textBaseline = baseLine;
    ctx.textAlign = textAlign;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, position[0], position[1]);
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
    const font = `${textDesign.fontSize}px ${textDesign.fontFamily}`;
    switch (textDesign.foulLineDirection) {
      case 'left':
        this._drawText(textDesign.text, textDesign.basePoint, textDesign.color, font, 'middle', 'left', this._ctx);
        break;
      case 'bottom':
        this._drawText(textDesign.text, textDesign.basePoint, textDesign.color, font, 'bottom', 'center', this._ctx);
        break;
      default:
        break;
    }
  }
  _createPatternView(patternDesign) {
    const border = patternDesign.border;
    const color = patternDesign.color;
    if (color.stroke) {
      this._drawBorder(border.path, border.width, border.style, color.stroke, this._ctx);
    }
    if (color.fill) {
      this._drawInner(border.path, color.fill, this._ctx);
    }
  }
  _createViewBaseDesign(design) {
    this._createTextView(design.textDesign);
    for (let patternDesign of design.patternDesign) {
      this._createPatternView(patternDesign);
    }
  }
  createView(viewData) {
    for (let refer of viewData.refer) {
      this._createViewBaseDesign(refer);
    }
    this._createViewBaseDesign(viewData.self);
  }
}

export { ConcreteCreatorView };
