FROM node:18-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

FROM node:18-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --production --frozen-lockfile
COPY --from=builder /build/admin ./admin
COPY --from=builder /build/migrations ./migrations
COPY --from=builder /build/dist ./dist

FROM build as device-api-http
EXPOSE 3000
CMD ["yarn", "start:http"]

FROM build as device-api-mqtt
CMD ["yarn", "start:mqtt"]
