# Project Name

> Perch - Cost of Home Ownership

## Related Projects

  - [Graph](https://github.com/team-perch/graph)
  - [Image Gallery](https://github.com/team-perch/imageGallery)

## Table of Contents

1. [API Endpoints](#API_Endpoints)
1. [Requirements](#requirements)
1. [Development](#development)

## API Endpoints

### PostgreSQL

1. Create
  - /api/costHomeOwnership/zipcode
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
2. Read
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
3. Update
  - /api/costHomeOwnership/zipcode
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
4. Delete
  - /api/costHomeOwnership/zipcode
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate

### Mongo

1. Create
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
2. Read
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
3. Update
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate
4. Delete
  - /api/costHomeOwnership/property
  - /api/costHomeOwnership/rate

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- mySQL 5.7

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
npm run build
npm run seed:dev
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.