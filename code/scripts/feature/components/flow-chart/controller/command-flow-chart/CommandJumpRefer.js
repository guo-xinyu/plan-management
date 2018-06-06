import { Command } from '../../../../../design-pattern-character/command/Command.js';

class CommandJumpRefer extends Command {
  execute(id) {
    for (let singleCommand of super.getCommandStack()) {
      singleCommand.command.update(id);
    }
  }
}

export { CommandJumpRefer };
