export class Csv {
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
