import { Transaction } from "./Transaction";

export class Item {
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
