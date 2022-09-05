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
		const cmd = cmds.find(
			(cmd) => cmd.name == answer || cmd.aliases.includes(answer)
		);
		if (!cmd) console.error(`command ${answer} not found!`);
		if (cmd?.name == "help") cmd.run(commands);
		else {
			cmd?.run(transactions);
		}
	}
	rl.close();
})();
