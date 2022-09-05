#!/opt/homebrew/bin/node
// @ts-ignore
import * as readline from "node:readline/promises";
import { readFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import { Csv } from "./classes/Csv";
import { Transaction } from "./classes/Transaction";
import { Item } from "./classes/Item";
import { Command } from "./classes/Command";
import { commands } from "./commands";

if (process.argv.length < 3) {
	console.error("Bad arguments!");
	process.exit(1);
}
const fd = process.argv[2];
const file = readFileSync(fd, { encoding: "utf-8" });

const csv = new Csv(file);
console.log(`csv loaded(s); ${csv.body.length} row.`);

const transactions: Transaction[] = Transaction.mklist(csv);
const cmds = Array.from(commands);

(async () => {
	const rl = readline.createInterface({ input, output });
	const exit = ["exit", "q"];

	while (1) {
		const answer: string = await rl.question("➡ ");
		if (exit.find((e) => e == answer.toLowerCase())) break;
		const args = answer.split(" ");

		const cmd = cmds.find(
			(cmd) => cmd.name == args[0] || cmd.aliases?.includes(args[0])
		);
		if (!cmd) console.error(`command ${args[0]} not found!`);

		switch (args.length) {
			case 1:
				if (cmd?.name == "help") cmd.run(commands);
				else cmd?.run(transactions);
				break;
			case 2:
				if (cmd?.name == "help") cmd.run(commands, args[1]);
				else if (cmd?.subCommands) {
					const subCmd = cmd.subCommands.find(
						(cmd) => cmd.name == args[1] || cmd.aliases?.includes(args[1])
					);
					if (!subCmd) console.error(`command ${args[1]} not found!`);
					subCmd?.run(transactions);
				} else console.error("bad arguments!");
				break;
		}
	}
	rl.close();
})();
