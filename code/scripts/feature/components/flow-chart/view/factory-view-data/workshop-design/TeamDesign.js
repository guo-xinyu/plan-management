import { TeamClosedPath } from './TeamClosedPath.js';
import { TeamStructure } from './TeamStructure.js';
import { DecoratorCanvasRenderingContext2D } from '../../decorator/DecoratorCanvasRenderingContext2D.js';

function compositePatternDesign(path, width, style, fillColor, strokeColor) {
  return {
    border: {
      path: path,
      style: style,
      width: width
    },
    color: {
      fill: fillColor,
      stroke: strokeColor
    }
  };
}

function compositeTextDesign(text, fontSize, fontFamily) {
  return {
    text,
    foulInterval: [
      [],
      [],
      [],
      []
    ],
    fontSize,
    fontFamily
  };
}

const teamClosedPath = Symbol();
const teamStructure = Symbol();
const decoratorCanvasRenderingContext2D = Symbol();

class TeamDesign {
  constructor() {
    this[teamClosedPath] = new TeamClosedPath();
    this[teamStructure] = new TeamStructure();
    this[decoratorCanvasRenderingContext2D] = new DecoratorCanvasRenderingContext2D(new CanvasRenderingContext2D());
  }
  // 生産節點名字處的“綫稿”
  fabricateNodeDesign(nodeBasePoint, index, childNum, name) {
    const nodeContentBasePoint = [
      nodeBasePoint[0] + this[teamStructure].nodeRightPadding,
      nodeBasePoint[1]
    ];

    const nodeNameSize = this[teamStructure].nodeNameSize;
    const fontFamily = this[teamStructure].fontFamily;

    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    const nameTextMeasureArea = this[decoratorCanvasRenderingContext2D].measureTextArea(name, nodeNameSize, fontFamily);
    patternDesign.push(compositePatternDesign(
      this[teamClosedPath].fabricateRectanglePath(nodeContentBasePoint, nameTextMeasureArea)));
    textDesign.push(compositeTextDesign(nodeBasePoint, nodeNameSize, fontFamily));
    // 豎綫裝飾的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    // 步驟軌道的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    textDesign.push(compositeTextDesign());
    // 圓圈標志的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    textDesign.push(compositeTextDesign());
    // 分叉軌道實綫部分的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    // 分叉軌道虚綫部分的“綫稿”
    patternDesign.push(compositePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
}

export { TeamDesign };
