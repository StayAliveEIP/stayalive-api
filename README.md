# StayAlive API

## Documentation

To access to the Swagger UI for route definition please use the following paths:
- Rescuer: http://localhost:3000/swagger/rescuer
- Call center: http://localhost:3000/swagger/call-center
- Admin: http://localhost:3000/swagger/admin

To access to the AsyncAPI UI for Socket.io definition please use the following [link](https://studio.asyncapi.com/?url=https://raw.githubusercontent.com/StayAliveEIP/stayalive-api/master/async-api.yaml).

## Description

The monolithic API for the StayAlive project.

[Nest](https://github.com/nestjs/nest) framework TypeScript used for this API.

## Installation

```bash
$ npm install
```

## Running the app

### Docker

```bash
docker-compose up
```

### Native

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
