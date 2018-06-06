import { Command } from '../../../../../design-pattern-character/command/Command.js';

// function moveChart(horizon, vertical) {

// }

class CommandDragFlowChart extends Command {
  // constructor() {
  // super();
  // this.add(moveChart);
  // }
  execute(horizon, vertical, state) {
    for (let singleCommand of super.getCommandStack()) {
      singleCommand.command.update({ transform: [horizon, vertical], state });
    }
  }
}

export { CommandDragFlowChart };
