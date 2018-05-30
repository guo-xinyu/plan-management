import { Decorator } from '../../../../../design-pattern-character/decorator/Decorator.js';

class DecoratorCanvasRenderingContext2D extends Decorator {
  constructor(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error('CanvasRenderingContext2D僅可裝飾CompositeData');
    }
    super(ctx);
  }
  static measureTextArea(str, fontSize, fontFamily) {
    if (typeof str !== 'string') {
      throw new Error('measureTextArea方法僅可丈量字符串的顯示區域。');
    }
    if (typeof fontSize !== 'number' || Number.isNaN(fontSize)) {
      throw new Error('請以數字定義measureTextArea方法中字符串的字號。');
    }
    if (typeof fontFamily !== 'string') {
      throw new Error('請以字符串定義measureTextArea方法中字符串的字體。');
    }
    this.font = `${fontSize}px ${fontFamily}`;
    return this.measureText(str);
  }
  static splitString2SomeLines(str, linePixelLimit) {
    const strArray = str.split(/\s+/g);
    let newString = '';
    for (let item of strArray) {
      if (!item) {
        continue;
      }
      let tempStrArray = newString.split('\n');
      let tempLastLine = tempStrArray[tempStrArray.length - 1];
      let tempStr = tempLastLine + ' ' + item;
      if (this.measureText(tempLastLine).width <= linePixelLimit && this.measureText(tempStr).width > linePixelLimit) {
        newString += '\n';
      } else {
        newString += ' ';
      }
      newString += item;
    }
    return newString;
  }
  static cutString(string, pixelLimit) {
    let cuttedString = '';
    for (let char of string) {
      let tmpStr = cuttedString + char + '…';
      if (this.measureText(tmpStr).width > pixelLimit) {
        return cuttedString + '…';
      }
      cuttedString += char;
    }
    return cuttedString;
  }
  static fillPath(path, fillStyle) {
    this.fillStyle = fillStyle;
    this.fill(path);
  }
  static strokePath(path, strokeStyle, lineWidth) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.stroke(path);
  }
}

export { DecoratorCanvasRenderingContext2D };
