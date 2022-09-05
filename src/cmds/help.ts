import { Command, ICommand } from "../classes/Command";

export const help = new Command(
	{
		name: "help",
		description: "List all commands",
		usage: "help",
		aliases: ["h", "?", "man"],
	},
	(commands: Set<Command>, command?: string) => {
		console.group(command || "COMMANDS");
		if (command) {
			const cmd = [...commands].find((c) => c.name === command);
			if (!cmd) return console.error(`command ${command} not found!`);
			console.log(`${cmd.name}: ${cmd.description}`);
			console.log(`usage: ${cmd.usage}`);
			console.log(`aliases: ${cmd.aliases?.join(", ")}`);
		} else
			commands.forEach((cmd) =>
				console.log(`${cmd.name} - ${cmd.description}`)
			);
		console.groupEnd();
	}
);
