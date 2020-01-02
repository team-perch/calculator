CREATE TABLE IF NOT EXISTS zips(
  zip_code INTEGER NOT NULL,
  property_tax_rate DECIMAL(5,3),
  population_of_zip INTEGER,
  crime_rate DECIMAL(5,3),
  CONSTRAINT zip_code PRIMARY KEY (zip_code)
);

CREATE TABLE IF NOT EXISTS properties(
  property_id SERIAL,
  zip_code INTEGER,
  redfin_cost_estimate INTEGER,
  insurance_rate DECIMAL(5,3),
  hoa_monthly_dues MONEY,
  construction_year SMALLINT,
  square_feet INTEGER,
  -- seed without fk constraints and index after seeding database
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
  CONSTRAINT property_id PRIMARY KEY (property_id)
);

CREATE TABLE IF NOT EXISTS lenders(
  lender_id SERIAL,
  lender_logo_url VARCHAR(80),
  lender_nmls INTEGER,
  CONSTRAINT lender_id PRIMARY KEY (lender_id)
);

CREATE TABLE IF NOT EXISTS rates(
  rate_id SERIAL,
  zip_code INTEGER,
  apr DECIMAL(5,3),
  term SMALLINT,
  loan_type VARCHAR(5),
  cost_low INTEGER,
  cost_high INTEGER,
  down_payment_min DECIMAL(4,1),
  credit_min SMALLINT,
  lender_id INTEGER,
  origination_year SMALLINT,
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
  FOREIGN KEY (lender_id) REFERENCES lenders(lender_id),
  CONSTRAINT rate_id PRIMARY KEY (rate_id)
);