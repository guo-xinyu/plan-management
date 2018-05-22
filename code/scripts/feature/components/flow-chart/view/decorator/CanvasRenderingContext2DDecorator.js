class CanvasRenderingContext2DDecorator {
  static splitString2SomeLines(str, linePixelLimit) {
    const strArray = str.split(/\s+/g);
    var newString = '';
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
    var cuttedString = '';
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

export { CanvasRenderingContext2DDecorator };
