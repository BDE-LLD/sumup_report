# Sumup report

![pnpm](https://img.shields.io/badge/pnpm-v7.9.5-blue)
![npm](https://img.shields.io/badge/npm-v8.18.0-blue)
![node](https://img.shields.io/badge/node-v18.8.0-green)
![tsc](https://img.shields.io/badge/tsc-v4.8.2-blue)

# <font color="yellow">NEW!</font>

- Finaly the code is cleaned! _The core at least_
- Anyone can now add feature as he/she plz
- Now use pnpm instead of npm

```
src/
	classes/
		Csv.ts
		Command.ts
		...
	cmds/
		help.ts
		sumup.ts
		..
	data/
		goodies_names.json
	commands.ts
	index.ts
```

## Quick start

```sh
pnpm install
pnpm build
pnpm start <csv_path>
```

Type help when the program has started

## Docker run

```sh
git clone https://github.com/BDE-LLD/sumup_report
cd sumup_report
docker build -t sumup_report .

cd {WORK_DIR}
docker run -it -v $PWD:/tmp/file sumup_report /tmp/file/{WORK_FILE}.csv
```

## Todo

better goodies command
get details about one item
support multiple csv files at once
