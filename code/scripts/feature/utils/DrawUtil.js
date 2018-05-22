class DrawUtil {
  static splitString2SomeLines(str, linePixelLimit, ctx) {
    const strArray = str.split(/\s+/g);
    var newString = '';
    for (let item of strArray) {
      if (!item) {
        continue;
      }
      let tempStrArray = newString.split('\n');
      let tempLastLine = tempStrArray[tempStrArray.length - 1];
      let tempStr = tempLastLine + ' ' + item;
      if (ctx.measureText(tempLastLine).width <= linePixelLimit && ctx.measureText(tempStr).width > linePixelLimit) {
        newString += '\n';
      } else {
        newString += ' ';
      }
      newString += item;
    }
    return newString;
  }
  static cutString(string, pixelLimit, ctx) {
    var cuttedString = '';
    for (let char of string) {
      let tmpStr = cuttedString + char + '…';
      if (ctx.measureText(tmpStr).width > pixelLimit) {
        return cuttedString + '…';
      }
      cuttedString += char;
    }
    return cuttedString;
  }
  static fillPath(path, fillStyle, ctx) {
    ctx.fillStyle = fillStyle;
    ctx.fill(path);
  }
  static strokePath(path, strokeStyle, lineWidth, ctx) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke(path);
  }
}

export { DrawUtil };
