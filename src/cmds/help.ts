import { Command, ICommand } from "../classes/Command";

export const help = new Command(
	{
		name: "help",
		description: "List all commands",
		usage: "help",
		aliases: ["h", "?", "man"],
	},
	(commands: Set<Command>) => {
		const table: Array<ICommand> = [];
		commands.forEach((cmd) => {
			table.push(cmd.row());
		});
		console.table(table);
	}
);
