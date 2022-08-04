# Sumup report

![npm](https://img.shields.io/badge/npm-v1.15.0-blue)
![node](https://img.shields.io/badge/node-v18.7.0-green)
![node](https://img.shields.io/badge/tsc-v4.7.4-blue)

```sh
npm install
npm run build
npm run start <csv_path>
```

Type help when the program has started

## Docker run
```sh
git clone https://github.com/BDE-LLD/sumup_report
cd sumup_report
docker build -t sumup_report .

cd {WORK_DIR}
docker run -v $PWD:/tmp/file sumup_report /tmp/file/{WORK_FILE}.csv
```
