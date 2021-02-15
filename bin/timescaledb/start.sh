#!/usr/bin/env bash

docker run -d --name device-api-timescaledb -p 5432:5432 -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=test \
  timescale/timescaledb:latest-pg12