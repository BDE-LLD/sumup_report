import { Command } from "../classes/Command";
import { Transaction } from "../classes/Transaction";
import { Item } from "../classes/Item";
import goodies_names from "../data/goodies_names.json";

const goodies = new Command(
	{
		name: "goodies",
		description: "List all goodies sold in an event",
		usage: "items goodies",
	},
	(transactions: Transaction[]) => {
		const goodies: Transaction[] = transactions.filter((trans) =>
			goodies_names.includes(trans.item_name)
		);
		const sum_goodies = goodies.reduce((prev, curr) => prev + curr.price, 0);
		const rd_bull: Transaction[] = transactions.filter(
			(trans) => trans.item_name == "1. Canette RedBull "
		);
		const sum_rd_bull = rd_bull.reduce((prev, curr) => prev + curr.price, 0);
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
		const rapport: {
			"Event dates": string;
			"Card Brut": number;
			"Sumup fees": number;
			Cash: number;
			Goodies: number;
			Redbull: number;
			Other: number;
		} = {
			"Event dates": [...dates].join(", "),
			"Card Brut": compta.card,
			"Sumup fees": Math.floor(compta.card * 1.75) / 100,
			Cash: compta.cash,
			Goodies: sum_goodies,
			Redbull: sum_rd_bull,
			Other: compta.total - sum_goodies - sum_rd_bull,
		};
		console.table(rapport);
	}
);

export const items = new Command(
	{
		name: "items",
		description: "List all items sold in an event",
		usage: "items",
	},
	(transactions: Transaction[]) => {
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
	[goodies]
);
