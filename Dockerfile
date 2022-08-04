FROM node:latest

WORKDIR /usr/src/sumup_report

COPY . .

RUN npm install tsc
RUN npm install typescript

RUN npm install
RUN npm run build

RUN mkdir -p /tmp/file

ENTRYPOINT ["npm", "run", "start"]
