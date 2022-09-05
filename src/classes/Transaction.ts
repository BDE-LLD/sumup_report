import { Csv } from "./Csv";
export class Transaction {
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

	get isCash() {
		return this.payment_method === "Cash";
	}
}
