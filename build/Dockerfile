FROM node:22-bookworm AS builder
WORKDIR /build
COPY package.json yarn.lock ./
COPY vendor/rfcx-notification-templates ./vendor/rfcx-notification-templates
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

FROM node:22-bookworm as device-api
WORKDIR /app
COPY package.json yarn.lock ./
COPY vendor/rfcx-notification-templates ./vendor/rfcx-notification-templates
RUN yarn --production --frozen-lockfile
COPY --from=builder /build/admin ./admin
COPY --from=builder /build/migrations ./migrations
COPY --from=builder /build/dist ./dist
EXPOSE 3000
CMD yarn start
