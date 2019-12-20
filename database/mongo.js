/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fetcher');
// const uniqueValidator = require('mongoose-unique-validator');

// added
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('connected');
});

const home = mongoose.Schema({
  // id: { type: Number, required: true, unique: false },
  zipcode: { type: Number, required: true, unique: false },
  insuranceRate: { type: Number, required: true, unique: false },
  population: { type: Number, required: true, unique: false },
  crimeRate: { type: Number, required: true, unique: false },
  squareFeet: { type: Number, required: true, unique: false },
  propertyTaxRate: { type: Number, required: true, unique: false },
  originationYear: { type: Number, required: true, unique: false },
});

const lenders = mongoose.Schema({
  // id: { type: Number, required: true, unique: false },
  APR: { type: Number, required: true, unique: false },
  Term: { type: String, required: true, unique: false },
  loanType: { type: Number, required: true, unique: false },
  costLow: { type: Number, required: true, unique: false },
  costHigh: { type: Number, required: true, unique: false },
  minDownPayment: { type: Number, required: true, unique: false },
  minCredit: { type: Number, required: true, unique: false },
});

// home.plugin(uniqueValidator);
const grab = (cb) => {
  Repo.find()
    .sort({ starNum: -1 })
    .limit(25)
    .then((results) => {
      cb(results);
    });
};

let Repo = mongoose.model('Repo', home);

console.log(lenders);

const save = (repository, cb) => {
  const repos = new Repo(repository);
  repos.save().then(cb(null));
};

module.exports.save = save;
module.exports.grab = grab;