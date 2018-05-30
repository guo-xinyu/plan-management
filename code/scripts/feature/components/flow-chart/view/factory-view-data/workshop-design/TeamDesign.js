import { TeamClosedPath } from './TeamClosedPath.js';

function fabricatePatternDesign(path, width, style, fillColor, strokeColor) {
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

function fabricateTextDesign(path, width, style, fillColor, strokeColor) {
  return {
    text: '',
    foulInterval: [
      [],
      []
    ],
    size: 'px'
  };
}

const teamClosedPath = Symbol();

class TeamDesign {
  constructor() {
    this[teamClosedPath] = new TeamClosedPath();
  }
  // 生産節點名字處的“綫稿”
  fabricateSNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    textDesign.push(fabricateTextDesign());
    // 豎綫裝飾的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    // 步驟軌道的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産步驟處的“綫稿”
  fabricateStepDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    textDesign.push(fabricateTextDesign());
    // 圓圈標志的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
  // 生産輸出節點處的“綫稿”
  fabricateOutputNodeDesign() {
    let patternDesign = [];
    let textDesign = [];
    // 文字區域的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    textDesign.push(fabricateTextDesign());
    // 分叉軌道實綫部分的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    // 分叉軌道虚綫部分的“綫稿”
    patternDesign.push(fabricatePatternDesign(this[teamClosedPath].fabricateRectanglePath()));
    return { textDesign, patternDesign };
  }
}

export { TeamDesign };
