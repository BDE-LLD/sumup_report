export interface ICommand {
	name: string;
	description: string;
	usage: string;
	aliases?: string[];
}

export class Command {
	private _data: ICommand;
	name: string;
	description: string;
	usage: string;
	aliases: string[];
	run: (...args: any[]) => any;
	constructor(row: ICommand, run: (...args: any[]) => any) {
		this._data = row;
		this.name = row["name"];
		this.description = row["description"];
		this.usage = row["usage"];
		this.aliases = row["aliases"] || [];
		this.run = run;
	}
	row() {
		return this._data;
	}
}
