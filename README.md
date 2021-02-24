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

Run tests:
`yarn test`

---

## More information

- [Deployment](./build/README.md)
