# RFCx Device API

Providing meta data on devices and deployments. Consumed by Device Management Console, [Companion App](https://github.com/rfcx/companion-android.git) and [Arbimon](https://github.com/rfcx/arbimon2.git)

---

## Getting started

Requirements:
- Node
- yarn
- Timescale (see below)

---

## Basics

Install dependencies

`yarn`

---

## Setup TimescaleDB locally using Docker

Start TimescaleDB container

```sh
yarn start.timescale
```

Run the migrations

On local machine (to apply env vars from `.env` file)
```sh
yarn migrate.dev
```

When you want to stop TimescaleDB

```sh
yarn stop.timescale
```

---

## Run local dev server (http) (live reload)

```sh
yarn serve:http
```


## Run local dev server (mqtt) (live reload)

```sh
yarn serve:mqtt
```

---

## Testing

### Run lint
```sh
yarn lint
```

### Run tests
```
yarn test
```

---

## More information

- [Deployment](./build/README.md)
