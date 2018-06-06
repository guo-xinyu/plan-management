import { Command } from '../../../../../design-pattern-character/command/Command.js';

class CommandCheckDetail extends Command {
  execute(data) {
    confirm(JSON.stringify(data, null, 2));
  }
}

export { CommandCheckDetail };
