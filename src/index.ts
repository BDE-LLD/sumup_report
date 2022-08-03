#! /Users/saky/.process/bin/process

// @ts-ignore
import * as readline from "node:readline/promises";
import { readFileSync } from "fs";
import { stdin as input, stdout as output } from "node:process";

class csv {
	private _data: Array<Array<string>>;
	readonly header: Array<string>;
	readonly body: Array<{ [key: string]: string }>;

	constructor(data: string) {
		this._data = data
			.split("\n")
			.map((element, key, map) => ((<Object>map[key]) = element.split(",")));
		this.header = this._data[0];
		this.body = this._data
			.slice(1, this._data.length - 1)
			.map((element, key, map) => ((<Object>map[key]) = this.mkrow(element)));
	}

	private mkrow(row: Array<string>) {
		let ret: { [key: string]: string } = {};
		this.header.forEach((head, key) => (ret[head] = row[key]));
		return ret;
	}

	filter(element: string, value: string) {
		return this.body.filter((el) => el[element] === value);
	}

	get users() {
		const users = new Set<string>();
		this.body.forEach((row) => users.add(row["Account"]));
		return users;
	}

	get dates() {
		const dates = new Set<string>();
		this.body.forEach((row) => dates.add(row["Date"]));
		return dates;
	}
}

if (process.argv.length != 3) {
	console.error("Bad arguments!");
	process.exit(1);
}
const fd = process.argv[2];

const raw_data = readFileSync(fd, { encoding: "utf-8" });

const data = new csv(raw_data);
console.log(`csv loaded; ${data.body.length} row.`);

(async () => {
	const rl = readline.createInterface({ input, output });

	let exit: boolean = true;
	while (exit) {
		const answer: string = await rl.question("➡ ");
		if (answer.toLowerCase() === "exit") exit = false;
		console.log(answer);
	}
	rl.close();
})();

/* const filtered = data.filter("Payment Method", "Cash");

const money = filtered.reduce(
	(prev, curr) => parseFloat(<string>prev) + parseFloat(curr["Price (Gross)"]),
	0
);
console.log(money); */
