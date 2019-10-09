![project status](https://img.shields.io/badge/status-demo-orange.svg)

# GraphQL Prima Demo

This repo contains two GraphQL samples baded on [primsa](https://www.prisma.io/). The first sample shows a model based on talks on conferences. The model shows a sample based on cities and a bit of information about the city. 

This sample is part of a [GraphQL Yoga Sample](https://github.com/npalm/graphql-prisma-yoga-demo) where both models will be combined in one GraphQL schema.

## Usages

### Required software
- Node 10+
- docker and docker-composse

### Start

Just run the start script, it will spin up docker containers for prisma and the database. Once up, prisma is deployed and some data is loaded via npm.

```
./start.sh
```

### Stop (clean)

Just run the stop script.

```
./stop.sh
```
