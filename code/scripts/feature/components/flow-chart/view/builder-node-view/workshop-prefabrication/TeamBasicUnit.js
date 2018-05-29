// define([
//   './GenerateClosedPath',
//   './DrawNormalShape',
//   '../utils/DrawBasicElementUtil',
//   'text!../const/colors.json',
//   'text!../const/drawMode.json'
// ], function(generateClosedPath, drawNormalShape, drawBasicElementUtil, colors, drawMode) {
//   const _drawMode = JSON.parse(drawMode);
//   const _colors = JSON.parse(colors);
//   const _themeColor = '#8c8c8c';
//   const _selectedColor = '#104E8B';
//   // const _transparent = 'rgba(0, 0, 0, 0)';
//   const _stepNameSize = 15;
//   const _nodeNameSize = 16;
//   const _stepNameEdgeSize = 2;
//   const _nodeNameEdigeSize = 0;
//   const _stepGoLineWidth = 3;
//   const _bwfStepNameBlank = 10;

//   function _drawBwfStepGoLine(position, length, rotatingDegree, index, ctx, mode) {
//     const xOffset = length * Math.cos(rotatingDegree);
//     const yOffset = length * Math.sin(rotatingDegree);
//     const startPosition1 = position;
//     const endPosition1 = [
//       position[0] + ((2 / 3) * xOffset),
//       position[1] + ((2 / 3) * yOffset)
//     ];
//     drawNormalShape.drawLine(startPosition1, endPosition1, _stepGoLineWidth, [],
//       _colors[index % _colors.length], ctx);
//     const endPosition2 = [
//       endPosition1[0] + ((1 / 3) * xOffset),
//       endPosition1[1] + ((1 / 3) * yOffset)
//     ];
//     const lineDash = mode === _drawMode.drawBwfStepGoLineMode.output ? [_stepGoLineWidth, _stepGoLineWidth] : [];
//     drawNormalShape.drawLine(endPosition1, endPosition2,
//       _stepGoLineWidth, lineDash, _colors[index % _colors.length], ctx);
//   }

//   function _drawBwfNodeName(name, position, index, ctx, mode, maxLength) {
//     const font = _nodeNameSize + 'px sans-serif';
//     const namePositionXOffset = _stepGoLineWidth * 2;
//     var lineDash = [];
//     var displayedName = name;
//     if (mode === _drawMode.drawBwfNodeNameMode.refered) {
//       lineDash = [
//         _stepGoLineWidth, _stepGoLineWidth
//       ];
//       ctx.font = font;
//       displayedName = drawBasicElementUtil.cutString(displayedName, maxLength - namePositionXOffset, ctx);
//     }
//     const startPosition = position;
//     const lineLength = (_nodeNameEdigeSize * 2) + _nodeNameSize;
//     const endPosition = [
//       position[0],
//       position[1] + lineLength
//     ];
//     drawNormalShape.drawLine(startPosition, endPosition, _stepGoLineWidth, lineDash, _colors[index % _colors.length],
//       ctx);

//     const namePosition = [
//       position[0] + namePositionXOffset,
//       position[1] + _nodeNameEdigeSize
//     ];
//     drawNormalShape.drawText(displayedName, namePosition, _themeColor, font, 'top', 'left', ctx);
//     ctx.font = font;
//     return generateClosedPath.generateRectanglePath(position, ctx.measureText(displayedName).width, lineLength);
//   }

//   function _drawBwfStepSymbol(position, rotatingDegree, index, ctx, mode) {
//     if (mode === _drawMode.drawBwfStepSymbolMode.usual) {
//       let path = generateClosedPath.generateStepUsualSymbolPath(position, _stepGoLineWidth);
//       drawBasicElementUtil.fillPath(path, '#FFFFFF', ctx);
//       drawBasicElementUtil.strokePath(path, _colors[index % _colors.length], 1, ctx);
//       return path;
//     }
//     let path = generateClosedPath.generateStepHasOutputSymbolPath(position, _stepGoLineWidth, rotatingDegree);
//     drawBasicElementUtil.fillPath(path, '#FFFFFF', ctx);
//     drawBasicElementUtil.strokePath(path, _themeColor, 1, ctx);
//     return path;
//   }

//   function _drawBwfStepName(text, position, ctx, mode, stepInterval) {
//     const backGroudColor = mode === _drawMode.drawStepNameMode.selected ? _selectedColor : _themeColor;
//     const font = _stepNameSize + 'px sans-serif';
//     ctx.font = font;
//     const textArray = drawBasicElementUtil.splitString2SomeLines(text,
//       stepInterval - _bwfStepNameBlank, ctx).split('\n');

//     var maxWidthTextMetrics = ctx.measureText(textArray[0]);
//     for (let textSingleLine of textArray) {
//       const currentTextMetrics = ctx.measureText(textSingleLine);
//       if (currentTextMetrics.width > maxWidthTextMetrics.width) {
//         maxWidthTextMetrics = currentTextMetrics;
//       }
//     }
//     const rectangleHeight = (_stepNameSize * textArray.length) + (_stepNameEdgeSize * (textArray.length + 1));
//     const rectPosition = [
//       position[0] - (maxWidthTextMetrics.width / 2),
//       position[1] - rectangleHeight
//     ];
//     var path = generateClosedPath.generateRectanglePath(rectPosition,
//       maxWidthTextMetrics.width + (_stepNameEdgeSize * 2), rectangleHeight);
//     drawBasicElementUtil.fillPath(path, backGroudColor, ctx);
//     for (let [index, element] of textArray.entries()) {
//       const textPosition = [
//         position[0] + _stepNameEdgeSize,
//         position[1] - ((_stepNameEdgeSize * (textArray.length - index)) +
//           (_stepNameSize * (textArray.length - index - 1)))
//       ];
//       drawNormalShape.drawText(element, textPosition, '#FFFFFF', font, 'bottom', 'center', ctx);
//     }
//     return path;
//   }

//   return {
//     drawBwfStepGoLine: _drawBwfStepGoLine,
//     drawBwfNodeName: _drawBwfNodeName,
//     drawBwfStepSymbol: _drawBwfStepSymbol,
//     drawBwfStepName: _drawBwfStepName
//   };
// });
