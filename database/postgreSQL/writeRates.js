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

const seedRates = (zips) => {
  const terms = [3, 5, 7, 10, 10, 15, 15, 20, 30, 30, 30, 30];
  const types = ['ARM', 'Fixed', 'Fixed'];
  const ratesCount = 10000;
  writer.pipe(fs.createWriteStream('database/postgreSQL/ratesData.csv'));
  for (let i = 0; i < ratesCount; i += 1) {
    const typee = types[faker.random.number(types.length - 1)];
    writer.write({
      zip: zips[faker.random.number(zips.length - 1)],
      apr: faker.random.number({ min: 4, max: 5.25, precision: 0.001 }),
      term: terms[faker.random.number(typee === 'Fixed'
        ? { min: 4, max: terms.length - 1 }
        : 3)],
      type: `${typee}`,
      low: faker.random.number({ min: 10000, max: 2000000, precision: 10000 }),
      high: faker.random.number({ min: 1000000, max: 3500000, precision: 100000 }),
      downPaymentMin: faker.random.number({ min: 0, max: 20, precision: 10 }),
      creditMin: faker.random.number({ min: 660, max: 740, precision: 20 }),
      lenderId: faker.random.number({ min: 1, max: 3 }),
    });
  }
  writer.end();
  console.log('finished writing rates CSV file');
};

seedRates(sharedZips);
