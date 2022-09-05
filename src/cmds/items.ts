import { Command } from "../classes/Command";
import { Transaction } from "../classes/Transaction";
import { Item } from "../classes/Item";

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
	}
);
