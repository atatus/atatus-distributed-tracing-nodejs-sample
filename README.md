# Distributed Tracing in Node.js with OpenTelemetry and Atatus

## Requirements

* Nodejs >=16
* MySQL 8
* serve

1) In the `src/model/index.ts` file, MySQL is imported for initializing the database connection."

```ts
const initializeDB = (cb) => {
  const sequelize = new Sequelize('db_name', 'username', 'password', {
  	...
  })

```

2) Copy the .env.example file to .env in the root directory.


3) Install all dependencies run below command

```bash
npm install
npm install -g serve
```

4) Start each service separately using below commands

```bash
npm run customers
npm run payment
npm run orders

# run ui using serve
serve ui
```

5) Access the application using below urls

```bash
http://localhost:3000/
http://localhost:8081/customer/{id}
http://localhost:8080/payment/transfer/id/4?amount=10000
```

## OTel Setup 

Install Otelcol-contribute [using this link](https://github.com/open-telemetry/opentelemetry-collector-releases/releases)


## Atatus collector Configuration

* you can use collector configuration file `atatus-collector.yaml` for send OTel data to Atatus.


## Run otel-contrib

```bash
./otelcol-contrib --config=<Your-Local-path>/atatus-collector.yaml
```