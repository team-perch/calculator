/* eslint-disable max-len */
/* eslint-disable no-console */
const faker = require('faker/locale/en_US');
const csvWriter = require('csv-write-stream');
const fs = require('fs');
// const path = require('path');

const writer = csvWriter();
const { dbConn, createDbTables, cleanDbTables } = require('./index');

const seedZips = (conn, zips) => {
  let query = '';
  for (let i = 0; i < zips.length; i += 1) {
    const zip = zips[i];
    const taxRate = faker.random.number({ min: 0.8, max: 1.2, precision: 0.1 });
    const population = faker.random.number({ min: 0, max: 115000 });
    const crimeRate = faker.random.number({ min: 0, max: 80 });
    const partialQuery = `INSERT INTO zips (
      zip_code,
      property_tax_rate,
      population_of_zip,
      crime_rate
      ) VALUES (
      ${zip},
      ${taxRate},
      ${population},
      ${crimeRate}
    );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

const seedProperties = async (conn, zips) => {
  const propertyCount = 10000000;
  writer.pipe(fs.createWriteStream('database/postgreSQL/data.csv'));
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
  console.log('finished writing the CSV file');
};

const seedLenders = (conn) => {
  const lenderLogoUrls = [
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10612_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/7834_logo.gif',
  ];

  const lenderCount = 3;
  let query = '';
  for (let i = 0; i < lenderCount; i += 1) {
    const nmls = faker.random.number({ min: 100000, max: 999999 });
    const partialQuery = `INSERT INTO lenders (
      lender_logo_url,
      lender_nmls
      ) VALUES (
        '${lenderLogoUrls[i]}',
        ${nmls}
      );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

const seedRates = (conn, zips) => {
  // weighted toward more popular options
  const terms = [3, 5, 7, 10, 10, 15, 15, 20, 30, 30, 30, 30];
  const types = ['ARM', 'Fixed', 'Fixed'];

  const loanCount = 1000;
  let query = '';
  for (let i = 0; i < loanCount; i += 1) {
    const zip = zips[faker.random.number(zips.length - 1)];
    const apr = faker.random.number({ min: 4, max: 5.25, precision: 0.001 });
    const type = types[faker.random.number(types.length - 1)];
    const term = terms[faker.random.number(type === 'Fixed'
      ? { min: 4, max: terms.length - 1 }
      : 3)];
    const low = faker.random.number({ min: 10000, max: 2000000, precision: 10000 });
    const high = faker.random.number({ min: 1000000, max: 3500000, precision: 100000 });
    const downPaymentMin = faker.random.number({ min: 0, max: 20, precision: 10 });
    const creditMin = faker.random.number({ min: 660, max: 740, precision: 20 });
    const lenderId = faker.random.number({ min: 1, max: 3 });

    const partialQuery = `INSERT INTO rates (
      zip_code,
      apr,
      term,
      loan_type,
      cost_low,
      cost_high,
      down_payment_min,
      credit_min,
      lender_id,
      origination_year
    ) VALUES (
      ${zip},
      ${apr},
      ${term},
      '${type}',
      ${low},
      ${high},
      ${downPaymentMin},
      ${creditMin},
      ${lenderId},
      ${2019}
    );\n`;
    query += partialQuery;
  }

  return conn.query(query);
};

// const csvSeeder = async (csvPath, conn) => {
//   conn.query(`COPY properties(zip_code, redfin_cost_estimate, insurance_rate, hoa_monthly_dues, construction_year, square_feet) FROM '${csvPath}' DELIMITER ',' CSV HEADER;`)
//     .then(() => {
//       console.log('I read the file!');
//     });
// };

/*
Put into postgres shell to copy from csv file


\COPY properties(zip_code, redfin_cost_estimate, insurance_rate, hoa_monthly_dues, construction_year, square_feet) FROM 'database/postgreSQL/data.csv' DELIMITER ',' CSV HEADER;

*/

/*
SAMPLE QUERY

SELECT * FROM rates AS r JOIN lenders AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= 2080000
    AND r.cost_high >= 2080000
    AND r.zip_code = 39470
    AND r.term = 30
    AND r.loan_type = 'Fixed'
    AND r.down_payment_min <= 20
    AND r.credit_min <= 740
    AND r.origination_year = 2019;
*/

const seedDb = async (conn) => {
  const db = await conn;

  let sharedZips = new Set();
  while (sharedZips.size <= 10) {
    const zip = faker.address.zipCode();
    if (zip.length === 5) {
      sharedZips.add(zip);
    }
  }
  sharedZips = [...sharedZips];
  console.log(sharedZips);

  await createDbTables(db);
  console.log('created database tables if non-existant');

  await cleanDbTables(db);
  console.log('cleaned database tables');

  await seedZips(db, sharedZips);
  console.log('seeded zips table');

  await seedLenders(db);
  console.log('seeded lenders table');

  await seedRates(db, sharedZips);
  console.log('seeded rates table');

  await seedProperties(db, sharedZips)
    .then(() => {
      // // for (let i = 0; i <= 10; i += 1) {
      // csvSeeder(path.resolve('database/postgreSQL/data.csv'), db);
      // // }
      console.log('done!');
    });
};

seedDb(dbConn).catch(console.log);
