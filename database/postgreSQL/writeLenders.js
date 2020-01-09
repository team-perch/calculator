const faker = require('faker/locale/en_US');
const csvWriter = require('csv-write-stream');
const fs = require('fs');

const writer = csvWriter();

const seedLenders = () => {
  const lenderLogoUrls = [
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10271_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/10612_logo.gif',
    'https://hrsf-fec-cho-lenderlogos.s3-us-west-1.amazonaws.com/7834_logo.gif',
  ];

  const lenderCount = 3;
  writer.pipe(fs.createWriteStream('database/postgreSQL/lendersData.csv'));
  for (let i = 0; i < lenderCount; i += 1) {
    writer.write({
      lenderLogoUrls: lenderLogoUrls[i],
      nmls: faker.random.number({ min: 100000, max: 999999 }),
    });
  }
  writer.end();
  console.log('finished writing lenders CSV file');
};

seedLenders();
