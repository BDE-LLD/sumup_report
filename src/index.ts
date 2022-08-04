// @ts-ignore
import * as readline from "node:readline/promises";
import { readFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import { type } from "node:os";

class Csv {
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
			.map((element, key, map) => ((<Object>map[key]) = this._mkrow(element)));
	}

	private _mkrow(row: Array<string>) {
		let ret: { [key: string]: string } = {};
		this.header.forEach((head, key) => (ret[head] = row[key]));
		return ret;
	}

	private _prop(prop: string) {
		const ret = new Set<string>();
		this.body.forEach((row) => ret.add(row[prop]));
		return ret;
	}

	filter(element: string, value: string) {
		return this.body.filter((el) => el[element] === value);
	}

	get users() {
		return this._prop("Account");
	}

	get dates() {
		return this._prop("Date");
	}
}

class Transaction {
	private _data: { [key: string]: string };
	user: string;
	item_name: string;
	date: string;
	time: string;
	id: string;
	payment_method: string;
	qty: number;
	price: number;

	constructor(row: { [key: string]: string }) {
		this._data = row;
		this.user = row["Account"].split("@")[0];
		this.item_name = row["Description"];
		this.date = row["Date"];
		this.time = row["Time"];
		this.id = row["Transaction ID"];
		this.payment_method = row["Payment Method"];
		this.qty = parseInt(row["Quantity"]);
		this.price = parseFloat(row["Price (Gross)"]);
	}

	static mklist(csv: Csv) {
		const ret: Transaction[] = [];
		csv.body.forEach((row) => ret.push(new Transaction(row)));
		return ret;
	}
}

class Item {
	name: string;
	price: number;

	constructor(name: string, price: number) {
		this.name = name;
		this.price = price;
	}

	/**
	 * Return how many this item has been sold in an event
	 * @param  {Array<Transaction>} transactions
	 */
	qty(transactions: Array<Transaction>) {
		const ret = transactions
			.filter((trans) => trans.item_name === this.name)
			.reduce((prev, curr) => <any>prev + curr.qty, 0);
		return ret;
	}

	static mklist(event: Transaction[]) {
		const items: Set<string> = new Set();
		event.forEach((trans) => items.add(trans.item_name));
		const ret: Item[] = [];
		items.forEach((item) => {
			const target = event.find((trans) => trans.item_name === item);
			const price = target ? target.price / target.qty : -1;
			ret.push(new Item(item, price));
		});
		return ret;
	}

	sum(transactions: Array<Transaction>) {
		return this.qty(transactions) * this.price;
	}
}

const cmds: { [key: string]: { description: string; run: Function } } = {
	items: {
		description: "Stats about items",
		run(transactions: [Transaction]) {
			const table: Array<{
				item: string;
				qty: number;
				"unit price (€)": number;
				"sum (€)": number;
			}> = [];

			const items: Item[] = Item.mklist(transactions);
			items.forEach((item) => {
				const qty = transactions
					.filter((trans) => trans.item_name === item.name)
					.reduce((prev, curr) => <any>prev + curr.qty, 0);
				table.push({
					item: item.name,
					qty: qty,
					"unit price (€)": item.price,
					"sum (€)": item.price * qty,
				});
			});
			table.sort((a, b) => b.qty - a.qty);
			console.table(table);
		},
	},
	staff: {
		description: "Stats about the staff",
		run(transactions: Transaction[]) {
			const table: Array<{
				name: string;
				transactions: number;
				"items sold": number;
				"sum (€)": number;
				"moy (€)": number;
				"participation (%)"?: number;
			}> = [];
			const total = transactions.reduce(
				(prev, curr) => <any>prev + curr.price,
				0
			);
			const users: Set<string> = new Set();
			transactions.forEach((trans) => users.add(trans.user));
			[...users].forEach((user) => {
				const trs: Transaction[] = transactions.filter(
					(trans) => trans.user === user
				);
				const items_sold: number = trs.reduce(
					(prev, curr) => <any>prev + curr.qty,
					0
				);
				const sum: number = trs.reduce(
					(prev, curr) => <any>prev + curr.price,
					0
				);
				table.push({
					name: user,
					transactions: trs.length,
					"items sold": items_sold,
					"sum (€)": sum,
					"moy (€)": Math.floor((sum / trs.length) * 100) / 100,
					"participation (%)": Math.floor(((sum * 100) / total) * 100) / 100,
				});
			});
			table.sort((a, b) => b["sum (€)"] - a["sum (€)"]);
			const items_sold = transactions.reduce(
				(prev, curr) => <any>prev + curr.qty,
				0
			);
			table.push({
				name: "TOTAL",
				transactions: transactions.length,
				"items sold": items_sold,
				"sum (€)": total,
				"moy (€)": Math.floor((total / items_sold) * 100) / 100,
			});
			console.table(table);
		},
	},
	report: {
		description: "Simple report of the transactions.",
		run(transactions: Transaction[]) {
			const users: Set<string> = new Set();
			transactions.forEach((trans) => users.add(trans.user));

			const compta = {
				total: transactions.reduce((prev, curr) => <any>prev + curr.price, 0),
				cash: transactions
					.filter((trans) => trans.payment_method === "Cash")
					.reduce((prev, curr) => <any>prev + curr.price, 0),
				card: transactions
					.filter((trans) => trans.payment_method === "Card")
					.reduce((prev, curr) => <any>prev + curr.price, 0),
			};
			const dates = new Set();
			transactions.forEach((trans) => dates.add(trans.date));
			const table: {
				"Event dates": string;
				Card: number;
				Cash: number;
				Total: number;
				"Panier moy (€)": number;
				"Staff's nb": number;
			} = {
				"Event dates": [...dates].join(", "),
				Card: compta.card,
				Cash: compta.cash,
				Total: compta.total,
				"Panier moy (€)":
					Math.floor((compta.total / transactions.length) * 100) / 100,
				"Staff's nb": users.size,
			};
			console.table(table);
		},
	},
	help: {
		description: "Help me!",
		run() {
			const ret = Object.keys(cmds).map(
				(cmd) => `• ${cmd}: ${cmds[cmd].description}`
			);
			console.log(ret.join("\n"));
		},
	},
};

if (process.argv.length != 3) {
	console.error("Bad arguments!");
	process.exit(1);
}
const fd = process.argv[2];
const file = readFileSync(fd, { encoding: "utf-8" });

const csv = new Csv(file);
console.log(`csv loaded; ${csv.body.length} row.`);

const transactions: Transaction[] = Transaction.mklist(csv);

(async () => {
	const rl = readline.createInterface({ input, output });
	const exit = ["exit", "q"];

	while (1) {
		const answer: string = await rl.question("➡ ");
		if (exit.find((e) => e == answer.toLowerCase())) break;
		const cmd = Object.keys(cmds).find((c) => c == answer);
		if (!cmd) console.error(`command not found!`);
		else {
			cmds[<any>cmd].run(transactions);
		}
	}
	rl.close();
})();
