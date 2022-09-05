import { Command } from "./classes/Command";
import { help } from "./cmds/help";
import { sumup } from "./cmds/sumup";
import { items } from "./cmds/items";
import { staff } from "./cmds/staff";

const commands: Set<Command> = new Set();
commands.add(help);
commands.add(sumup);
commands.add(items);
commands.add(staff);

console.group("Commands");
commands.forEach((cmd) => console.log(cmd.name + "     \t🟢"));
console.groupEnd();
export { commands };

/** TODO
 * add unit tests for all commands
 */
