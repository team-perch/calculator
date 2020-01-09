const faker = require('faker/locale/en_US');
const csvWriter = require('csv-write-stream');
const fs = require('fs');

const writer = csvWriter();

const sharedZips = [
  91914,
  21382,
  91977,
  94606,
  19872,
  12768,
  18762,
  12879,
  12987,
  64689,
];

const seedProperties = async (zips) => {
  const propertyCount = 10000000;
  writer.pipe(fs.createWriteStream('database/postgreSQL/propertiesData.csv'));
  for (let i = 0; i < propertyCount; i += 1) {
    writer.write({
      zip: zips[faker.random.number(zips.length - 1)],
      cost: faker.random.number({ min: 60000, max: 2000000 }),
      insuranceRate: faker.random.number({ min: 0.1, max: 0.2, precision: 0.1 }),
      hoaDues: faker.random.number({ min: 0, max: 1000 }),
      constrYear: faker.random.number({ min: 1900, max: 2019 }),
      squareFeet: faker.random.number({ min: 800, max: 10000 }),
    });
  }
  writer.end();
  console.log('finished writing properties CSV file');
};

seedProperties(sharedZips);
