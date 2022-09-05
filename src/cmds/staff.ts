import { Command } from "../classes/Command";
import { Transaction } from "../classes/Transaction";

interface IStaff {
	name: string;
	transactions: number;
	"items sold": number;
	"sum (€)": number;
	"moy (€)": number;
	"participation (%)"?: number;
	"Cash (€)": number;
	"Card (€)": number;
}

export const staff = new Command(
	{
		name: "staff",
		description: "Stats about the staff",
		usage: "staff",
	},
	(transactions: Transaction[]) => {
		const table: IStaff[] = [];
		const total = transactions.reduce(
			(prev, curr) => <any>prev + curr.price,
			0
		);
		const staff: Set<string> = new Set();
		transactions.forEach((trans) => staff.add(trans.user));
		[...staff].forEach((user) => {
			const trs: Transaction[] = transactions.filter(
				(trans) => trans.user === user
			);
			const items_sold: number = trs.reduce(
				(prev, curr) => <any>prev + curr.qty,
				0
			);
			const sum: number = trs.reduce((prev, curr) => <any>prev + curr.price, 0);
			const items_cash: Transaction[] = trs.filter(
				(trans) => trans.payment_method === "Cash"
			);
			const items_card: Transaction[] = trs.filter(
				(trans) => trans.payment_method === "Card"
			);
			const sum_card: number = items_card.reduce(
				(prev, curr) => <any>prev + curr.price,
				0
			);
			const sum_cash: number = items_cash.reduce(
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
				"Cash (€)": sum_cash,
				"Card (€)": sum_card,
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
			"participation (%)": 0,
			"Cash (€)": 0,
			"Card (€)": 0,
		});
		console.table(table);
	}
);
