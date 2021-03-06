import { TeamPath } from './TeamPath.js';
import { TeamStructure } from './TeamStructure.js';
import { DecoratorCanvasRenderingContext2D } from '../../decorator/DecoratorCanvasRenderingContext2D.js';

const teamPath = Symbol();
const teamStructure = Symbol();
const decoratorCanvasRenderingContext2D = Symbol();
const designType = Symbol();

class TeamDesign {
  constructor(basePoint, ctx) {
    this._basePoint = basePoint;
    this[teamPath] = new TeamPath();
    this[teamStructure] = new TeamStructure();
    this[decoratorCanvasRenderingContext2D] = new DecoratorCanvasRenderingContext2D(ctx);

    this[designType] = {
      node: {
        text: Symbol(),
        decorationLine: Symbol(),
        railLine: Symbol()
      },
      step: {
        text: Symbol(),
        symbol: Symbol()
      },
      outputNode: {
        text: Symbol(),
        railLine: Symbol(),
        decorationLine: Symbol()
      }
    };
    this.stateStep = {
      usual: Symbol(),
      transfer: Symbol()
    };
  }
  setBasePoint(basePoint) {
    this._basePoint = basePoint;
  }
  _cutString(oText, state) {
    switch (state) {
      case this[designType].outputNode.text:
        return this[decoratorCanvasRenderingContext2D].cutString(oText, this[teamStructure].stepInterval -
          this[teamStructure].nodeNameDecorateLineWidth - this[teamStructure].nodeNameTextLineBlank);
      case this[designType].node.text:
        return oText;
      case this[designType].step.text:
        return this[decoratorCanvasRenderingContext2D].splitString2SomeLines(oText,
          this[teamStructure].stepInterval - this[teamStructure].bwfStepNameBlank);
      default:
        break;
    }
  }
  _compositeTextDesign(oText, oBasePoint, state) {
    let foulLineDirection = '';
    let text = this._cutString(oText, state);
    let basePoint = [];
    let color = '';
    let fontSize = 0;
    let background = '';

    switch (state) {
      case this[designType].outputNode.text:
      case this[designType].node.text:
        color = this[teamStructure].themeColor;
        foulLineDirection = 'left';
        fontSize = this[teamStructure].nodeNameSize;
        basePoint.push(oBasePoint[0] + this[teamStructure].nodeNameDecorateLineWidth +
          this[teamStructure].nodeNameTextLineBlank);
        basePoint.push(oBasePoint[1] + (this[teamStructure].nodeNameSize / 2));
        break;
      case this[designType].step.text:
        color = '#FFFFFF';
        foulLineDirection = 'bottom';
        background = this[teamStructure].themeColor;
        fontSize = this[teamStructure].stepNameSize;
        basePoint.push(oBasePoint[0]);
        basePoint.push(oBasePoint[1] - this[teamStructure].bwfStepNameBlank);
        break;
      default:
        break;
    }

    return {
      text,
      basePoint,
      foulLineDirection,
      color,
      background,
      fontSize,
      fontFamily: this[teamStructure].fontFamily
    };
  }
  _compositePatternDesign(path, width, style, strokeColor, fillColor) {
    return {
      border: {
        path,
        style,
        width
      },
      color: {
        fill: fillColor,
        stroke: strokeColor
      }
    };
  }
  _getTextWidth(multiLinesText, fontSize, fontFamily, util) {
    let width = 0;
    for (let lineText of multiLinesText) {
      let newWidth = util.measureTextArea(lineText, fontSize, fontFamily).width;
      if (newWidth > width) {
        width = newWidth;
      }
    }
    return width;
  }
  _getTextRectangleDesign(singleTextDesign) {
    const multiLinesText = singleTextDesign.text.split('\n');
    const textHeight = multiLinesText.length * singleTextDesign.fontSize;
    const textWidth = this._getTextWidth(multiLinesText, singleTextDesign.fontSize, singleTextDesign.fontFamily,
      this[decoratorCanvasRenderingContext2D]);
    let nodeContentBasePoint = [];

    switch (singleTextDesign.foulLineDirection) {
      case 'left':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0]);
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] - (textHeight / 2));
        break;
      case 'bottom':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0] - (textWidth / 2));
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] - textHeight);
        break;
      default:
        break;
    }
    return [this._compositePatternDesign(
      this[teamPath].fabricateRectanglePath(nodeContentBasePoint, {
        width: textWidth,
        height: textHeight
      }), '', '', '', singleTextDesign.background)];
  }
  _getLineDesign(oBasePoint, length, color, state) {
    let serialPatternDesign = [];
    let startPoint = [];
    let endPoint = [];
    switch (state) {
      case this[designType].node.decorationLine:
        startPoint.push(...oBasePoint);
        endPoint.push(startPoint[0]);
        endPoint.push(startPoint[1] + length);
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStraightLinePath(startPoint, endPoint),
          this[teamStructure].nodeNameDecorateLineWidth, 'solid', color, ''));
        return serialPatternDesign;
      case this[designType].node.railLine:
        startPoint.push(oBasePoint[0] + (this[teamStructure].stepInterval / 2));
        startPoint.push(oBasePoint[1] + this[teamStructure].stepGoLineYOffset);
        endPoint.push(oBasePoint[0] + (this[teamStructure].stepInterval / 2) + length);
        endPoint.push(oBasePoint[1] + this[teamStructure].stepGoLineYOffset);
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStraightLinePath(startPoint, endPoint),
          this[teamStructure].stepGoLineWidth, 'solid', color, ''));
        return serialPatternDesign;
        // case this[designType].step.symbol:
        //   return serialPatternDesign;
      case this[designType].outputNode.railLine:
        {
          const xOffset = length * Math.cos(this[teamStructure].outputRotatingDegree);
          const yOffset = length * Math.sin(this[teamStructure].outputRotatingDegree);
          const startPosition1 = oBasePoint;
          const endPosition1 = [
            oBasePoint[0] + (this[teamStructure].outputRailSolidLengthRadio * xOffset),
            oBasePoint[1] + (this[teamStructure].outputRailSolidLengthRadio * yOffset)
          ];
          serialPatternDesign.push(this._compositePatternDesign(
            this[teamPath].fabricateStraightLinePath(startPosition1, endPosition1),
            this[teamStructure].stepGoLineWidth, 'solid', color, ''));
          const endPosition2 = [
            endPosition1[0] + ((1 / 3) * xOffset),
            endPosition1[1] + ((1 / 3) * yOffset)
          ];
          serialPatternDesign.push(this._compositePatternDesign(
            this[teamPath].fabricateStraightLinePath(endPosition1, endPosition2),
            this[teamStructure].stepGoLineWidth, 'dashed', color, ''));
        }
        return serialPatternDesign;
      case this[designType].outputNode.decorationLine:
        startPoint.push(...oBasePoint);
        endPoint.push(startPoint[0]);
        endPoint.push(startPoint[1] + length);
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStraightLinePath(startPoint, endPoint),
          this[teamStructure].nodeNameDecorateLineWidth, 'dashed', color, ''));
        return serialPatternDesign;
      default:
        break;
    }
    // return this[teamPath].fabricateStraightLinePath(startPoint, endPoint);
  }
  _getStepSymbolDesign(oBasePoint, color, stepSymbolState) {
    const white = '#ffffff';
    let serialPatternDesign = [];
    switch (stepSymbolState) {
      case this.stateStep.usual:
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStepSymbolPath(
            oBasePoint, this[teamStructure].stepGoLineWidth, this[teamPath].fabricateStepSymbolPathState.usual),
          this[teamStructure].stepSymbolBorderWidth, 'solid', color, white));
        return serialPatternDesign;
      case this.stateStep.transfer:
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStepSymbolPath(oBasePoint, this[teamStructure].stepGoLineWidth,
            this[teamPath].fabricateStepSymbolPathState.transfer, this[teamStructure].outputRotatingDegree),
          this[teamStructure].stepSymbolBorderWidth, 'solid', this[teamStructure].themeColor, white));
        return serialPatternDesign;
      default:
        break;
    }
  }
  _getNodeBasePoint(nodeRank) {
    return [
      this._basePoint[0],
      this._basePoint[1] + (this[teamStructure].nodeGroupHeight * nodeRank)
    ];
  }
  // 生産節點名字處的“綫稿”
  fabricateNodeDesign(rank, color, childNum, name) {
    const nodeBasePoint = this._getNodeBasePoint(rank);
    const nodeContentBasePoint = [
      nodeBasePoint[0] + this[teamStructure].nodeLeftPadding,
      nodeBasePoint[1] + this[teamStructure].nodeTopPadding
    ];

    let patternDesign = [];
    let textDesign = [];
    // 文字區域和豎綫裝飾的“綫稿”
    const singleTextDesign = this._compositeTextDesign(name, nodeContentBasePoint, this[designType].node.text);
    // console.log(singleTextDesign);
    textDesign.push(singleTextDesign);

    patternDesign.push(...this._fabricateNodeNameDesign(nodeContentBasePoint, singleTextDesign, color,
      this[designType].node.decorationLine));

    // 步驟軌道的“綫稿”
    patternDesign.push(...this._getLineDesign(nodeContentBasePoint, this[teamStructure].stepInterval * (childNum - 1),
      color, this[designType].node.railLine));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign(nodeRank, color, index, name, state) {
    const nodeBasePoint = this._getNodeBasePoint(nodeRank);
    const contentBasePoint = [
      nodeBasePoint[0] + (this[teamStructure].stepInterval * (((index * 2) + 1) / 2)),
      nodeBasePoint[1] + this[teamStructure].stepGoLineYOffset
    ];
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const singleTextDesign = this._compositeTextDesign(name, contentBasePoint, this[designType].step.text);
    // console.log(singleTextDesign);
    textDesign.push(singleTextDesign);
    patternDesign.push(...this._getTextRectangleDesign(singleTextDesign));
    // 圓圈標志的“綫稿”
    patternDesign.push(...this._getStepSymbolDesign(contentBasePoint, color, state));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign(nodeRank, color, index, name, id) {
    const nodeBasePoint = this._getNodeBasePoint(nodeRank);
    const contentBasePoint = [
      nodeBasePoint[0] + (this[teamStructure].stepInterval * (((index * 2) + 1) / 2)),
      nodeBasePoint[1] + this[teamStructure].stepGoLineYOffset
    ];
    let patternDesign = [];
    let textDesign = [];
    // 分叉軌道部分的“綫稿”
    patternDesign.push(...this._getLineDesign(contentBasePoint, this[teamStructure].stepInterval, color,
      this[designType].outputNode.railLine));
    // 文字區域和豎綫裝飾的“綫稿”
    const nodeContentBasePoint = [
      contentBasePoint[0] + (this[teamStructure].stepInterval * Math.cos(this[teamStructure].outputRotatingDegree)),
      contentBasePoint[1] + (this[teamStructure].stepInterval * Math.sin(this[teamStructure].outputRotatingDegree))
    ];
    const singleTextDesign = this._compositeTextDesign(name, nodeContentBasePoint, this[designType].outputNode.text);
    textDesign.push(singleTextDesign);
    patternDesign.push(...this._fabricateNodeNameDesign(nodeContentBasePoint, singleTextDesign, color,
      this[designType].outputNode.decorationLine));
    return { id, textDesign, patternDesign };
  }
  _fabricateNodeNameDesign(nodeContentBasePoint, singleTextDesign, color, state) {
    let patternDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(...this._getTextRectangleDesign(singleTextDesign));

    // 豎綫裝飾的“綫稿”
    patternDesign.push(...this._getLineDesign(nodeContentBasePoint, this[teamStructure].nodeNameSize, color,
      state));
    return patternDesign;
  }
}

export { TeamDesign };
