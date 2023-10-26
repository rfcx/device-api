# RFCx Device API

Providing meta data on devices and deployments. Consumed by Device Management Console, [Companion App](https://github.com/rfcx/companion-android.git) and [Arbimon](https://github.com/rfcx/arbimon2.git)

---

## Getting started

Requirements:
- Node
- yarn
- Postgres (see below)

### Basics

Install dependencies

`yarn`

// TODO: Configure environment variables? Shouldn't be needed if using Docker.

Run local dev serve (live reload)

`yarn serve`

### Setup Postgres with Docker

Start Postgres container

`docker run -d --rm --name pg -e POSTGRES_PASSWORD=test -p 5432:5432 postgres`

Create the schema needed

`docker exec -it pg psql -U postgres --command "create schema sequelize;"`

Run the migrations

`yarn migrate`

You are ready to run `yarn serve` and test the endpoints.

---

## Testing

Run lint:
`yarn lint`

Tests are to test a set of component (functions, modules) working together which it requires a database open (it is requirement to this API).

To run all the tests, you will need to have a test database running. It is recommented to use a separated database from your development database because the data will be dropped from the tables when running tests.

To start a test database (requires Docker to be running):

```
yarn serve-db:test
```

Run tests:

```
yarn test
```

---

## More information

- [Deployment](./build/README.md)
