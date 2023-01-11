#!/usr/bin/env bash

docker volume create device_postgres_data

docker container rm device-api-timescaledb

docker run -d --name device-api-timescaledb -p 5432:5432 -v device_postgres_data:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=test \
  timescale/timescaledb:latest-pg11

docker exec -it device-api-timescaledb psql -U postgres \
  --command "create database device;" --command "\connect device;" \ --command "create schema sequelize;" \
  --command "create database guardian;" --command "\connect guardian;" \ --command "create schema sequelize;"
