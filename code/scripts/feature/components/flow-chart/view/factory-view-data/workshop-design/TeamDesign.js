import { TeamPath } from './TeamPath.js';
import { TeamStructure } from './TeamStructure.js';
import { DecoratorCanvasRenderingContext2D } from '../../decorator/DecoratorCanvasRenderingContext2D.js';

const teamPath = Symbol();
const teamStructure = Symbol();
const decoratorCanvasRenderingContext2D = Symbol();
const designType = Symbol();
const colors = Symbol();

class TeamDesign {
  constructor() {
    this[teamPath] = new TeamPath();
    this[teamStructure] = new TeamStructure();
    this[decoratorCanvasRenderingContext2D] = new DecoratorCanvasRenderingContext2D(new CanvasRenderingContext2D());
    this[colors] = [
      '#8dc434',
      '#f5ba05',
      '#c05fd5',
      '#35cbd5',
      '#f2811c',
      '#ee68a9',
      '#2496f5',
      '#f1e12b',
      '#7c81e6',
      '#57dca5'
    ];
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
  _cutString(oText, state) {
    switch (state) {
      case this[designType].outputNode.text:
        return this[decoratorCanvasRenderingContext2D].cutString(oText, this[teamStructure].stepInterval -
          this[teamStructure].this.nodeNameDecorateLineWidth - this[teamStructure].nodeNameTextLineBlank);
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

    switch (state) {
      case this[designType].outputNode.text:
      case this[designType].node.text:
        foulLineDirection = 'left';
        basePoint.push(oBasePoint[0] + this[teamStructure].this.nodeNameDecorateLineWidth +
          this[teamStructure].nodeNameTextLineBlank);
        basePoint.push(oBasePoint[1] + (this[teamStructure].nodeNameSize / 2));
        break;
      case this[designType].step.text:
        foulLineDirection = 'bottom';
        basePoint.push(oBasePoint[0]);
        basePoint.push(oBasePoint[1] + this[teamStructure].bwfStepNameBlank);
        break;
      default:
        break;
    }

    return {
      text,
      basePoint,
      foulLineDirection,
      fontSize: this[teamStructure].nodeNameSize,
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
  _getTextRectangleDesign(singleTextDesign) {
    const nameTextMeasureArea = this[decoratorCanvasRenderingContext2D].measureTextArea(singleTextDesign.text,
      singleTextDesign.fontSize, singleTextDesign.fontFamily);
    let nodeContentBasePoint = [];

    switch (singleTextDesign.foulLineDirection) {
      case 'left':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0]);
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] + (nameTextMeasureArea.height / 2));
        break;
      case 'bottom':
        nodeContentBasePoint.push(singleTextDesign.basePoint[0] - (nameTextMeasureArea.width / 2));
        nodeContentBasePoint.push(singleTextDesign.basePoint[1] - nameTextMeasureArea.height);
        break;
      default:
        break;
    }
    return this._compositePatternDesign(
      [this[teamPath].fabricateRectanglePath(nodeContentBasePoint, nameTextMeasureArea)], '',
      this[designType].node.text);
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
        return serialPatternDesign;
      case this[designType].outputNode.decorationLine:
        return serialPatternDesign;
      default:
        break;
    }
    return this[teamPath].fabricateStraightLinePath(startPoint, endPoint);
  }
  _getStepSymbolDesign(oBasePoint, color, stepSymbolState) {
    let serialPatternDesign = [];
    switch (stepSymbolState) {
      case this.stateStep.usual:
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStepSymbolPath(
            oBasePoint, this[teamStructure].stepGoLineWidth, this[teamPath].fabricateStepSymbolPathState.usual),
          this[teamStructure].stepSymbolBorderWidth, 'solid', color, ''));
        return serialPatternDesign;
      case this.stateStep.transfer:
        serialPatternDesign.push(this._compositePatternDesign(
          this[teamPath].fabricateStepSymbolPath(oBasePoint, this[teamStructure].stepGoLineWidth,
            this[teamPath].fabricateStepSymbolPathState.transfer, this[teamStructure].outputRotatingDegree),
          this[teamStructure].stepSymbolBorderWidth, 'solid', this[teamStructure].themeColor, ''));
        return serialPatternDesign;
      default:
        break;
    }
  }
  // 生産節點名字處的“綫稿”
  fabricateNodeDesign(nodeBasePoint, color, childNum, name) {
    const nodeContentBasePoint = [
      nodeBasePoint[0] + this[teamStructure].nodeLeftPadding,
      nodeBasePoint[1] + this[teamStructure].nodeTopPadding
    ];

    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const singleTextDesign = this._compositeTextDesign(name, nodeContentBasePoint, this[designType].node.text);
    textDesign.push(singleTextDesign);

    patternDesign.push(this._getTextRectangleDesign(singleTextDesign));

    // 豎綫裝飾的“綫稿”
    patternDesign.push(this._getLineDesign(nodeContentBasePoint, this[teamStructure].nodeNameSize, color,
      this[designType].node.decorationLine));
    // 步驟軌道的“綫稿”
    patternDesign.push(this._getLineDesign(nodeContentBasePoint, this[teamStructure].stepInterval * (childNum - 1),
      color, this[designType].node.railLine));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign(nodeBasePoint, color, index, name, state) {
    const contentBasePoint = [
      nodeBasePoint[0] + (this[teamStructure].stepInterval * (((index * 2) + 1) / 2)),
      nodeBasePoint[1] + this[teamStructure].stepGoLineYOffset
    ];
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const singleTextDesign = this._compositeTextDesign(name, contentBasePoint, this[designType].node.text);
    textDesign.push(singleTextDesign);
    patternDesign.push(this._getTextRectangleDesign(singleTextDesign));
    // 圓圈標志的“綫稿”
    patternDesign.push(this._getStepSymbolDesign(contentBasePoint, color, state));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // textDesign.push(compositeTextDesign());
    // 分叉軌道實綫部分的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    // 分叉軌道虚綫部分的“綫稿”
    // patternDesign.push(compositePatternDesign(this[teamPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
}

export { TeamDesign };
