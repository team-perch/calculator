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

const seedZips = (zips) => {
  writer.pipe(fs.createWriteStream('database/postgreSQL/zipsData.csv'));
  for (let i = 0; i < zips.length; i += 1) {
    writer.write({
      zip: zips[i],
      taxRate: faker.random.number({ min: 0.8, max: 1.2, precision: 0.1 }),
      population: faker.random.number({ min: 0, max: 115000 }),
      crimeRate: faker.random.number({ min: 0, max: 80 }),
    });
  }
  writer.end();
  console.log('finished writing zips CSV file');
};

seedZips(sharedZips);
