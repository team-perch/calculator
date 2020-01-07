/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { dbConn } = require('../database/postgreSQL/index.js');

const updateClientBundle = async () => {
  const url = 'https://hrsf-fec-nz.s3-us-west-2.amazonaws.com/bundle.js';
  const bundleFilePath = path.resolve(__dirname, '..', 'public', 'bundle.js');
  const writer = fs.createWriteStream(bundleFilePath);

  const res = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  res.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('bundle updated from s3');
      resolve();
    });
    writer.on('error', (err) => {
      console.log('error retrieving bundle from s3');
      console.log(err);
      reject();
    });
  });
};

const getPropertyData = async (id) => {
  const query = `SELECT * FROM properties AS p JOIN zips AS z
    ON p.zip_code = z.zip_code
    WHERE property_id = $1`;

  const conn = await dbConn;
  return conn.query(query, [id]);
};

const getRates = async (cost, zip, term, type, downPay, credit, origYear) => {
  console.log('2');
  const query = `SELECT * FROM rates AS r JOIN lenders AS l
    ON r.lender_id = l.lender_id
    WHERE r.cost_low <= $1
    AND r.cost_high >= $2
    AND r.zip_code = $3
    AND r.term = $4
    AND r.loan_type = $5
    AND r.down_payment_min <= $6
    AND r.credit_min <= $7
    AND r.origination_year = $8`;

  const conn = await dbConn;

  const financedCost = Math.floor(cost * ((100 - downPay) / 100));
  console.log('3');
  return conn.query(query, [
    financedCost,
    financedCost,
    zip,
    term,
    type,
    downPay,
    credit,
    origYear,
  ]);
};

module.exports = {
  updateClientBundle,
  getPropertyData,
  getRates,
};
