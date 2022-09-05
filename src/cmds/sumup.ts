import { Command } from "../classes/Command";
import { Transaction } from "../classes/Transaction";

interface ISumup {
	"Event dates": string;
	"Card Brut": number;
	"Card Net": number;
	Cash: number;
	"Total Brut": number;
	"Total Net": number;
	"Sumup fees": number;
	"Panier moy (€)": number;
	"Staff's nb": number;
}

export const sumup = new Command(
	{
		name: "sumup",
		description: "Sum up the total amount of money spent in an event",
		usage: "sumup",
	},
	(transactions: Transaction[]) => {
		const users: Set<string> = new Set();
		transactions.forEach((trans) => users.add(trans.user));
		const compta = {
			total: transactions.reduce((prev, curr) => <any>prev + curr.price, 0),
			cash: transactions
				.filter((trans) => trans.isCash)
				.reduce((prev, curr) => <any>prev + curr.price, 0),
			card: transactions
				.filter((trans) => !trans.isCash)
				.reduce((prev, curr) => <any>prev + curr.price, 0),
		};
		const dates: Set<string> = new Set();
		transactions.forEach((trans) => dates.add(trans.date));
		const table: ISumup = {
			"Event dates": `${[...dates][1]}, ${[...dates][dates.size - 1]}`,
			"Card Brut": compta.card,
			"Card Net": Math.floor(compta.card * 98.25) / 100,
			Cash: compta.cash,
			"Total Brut": compta.total,
			"Total Net": Math.floor(compta.card * 98.25) / 100 + compta.cash,
			"Sumup fees": Math.floor(compta.card * 1.75) / 100,
			"Panier moy (€)":
				Math.floor((compta.total / transactions.length) * 100) / 100,
			"Staff's nb": users.size,
		};
		console.table(table);
	}
);
