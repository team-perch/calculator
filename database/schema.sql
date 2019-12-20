CREATE DATABASE name
    [ [ WITH ] [ OWNER [=] user_name ]
           [ TEMPLATE [=] template ]
           [ ENCODING [=] encoding ]
           [ LC_COLLATE [=] lc_collate ]
           [ LC_CTYPE [=] lc_ctype ]
           [ TABLESPACE [=] tablespace ]
           [ CONNECTION LIMIT [=] connlimit ] ]
            \connect --databasename

CREATE TABLE IF NOT EXISTS zips(
  zip_code VARCHAR(10) NOT NULL,
  property_tax_rate DECIMAL(5,3),
  population_of_zip INTEGER,
  crime_rate DECIMAL(5,3),
  CONSTRAINT zip_code PRIMARY KEY (zip_code)
);

CREATE TABLE IF NOT EXISTS properties(
  property_id SERIAL PRIMARY KEY,
  zip_code VARCHAR(10),
  square_feet INTEGER,
  redfin_cost_estimate INTEGER,
  insurance_rate DECIMAL(5,3),
  -- seed without fk constraints and index after seeding database
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
);

CREATE TABLE IF NOT EXISTS lenders(
  lender_id INTEGER NOT NULL AUTO_INCREMENT,
  lender_logo_url VARCHAR(80),
  lender_nmls INTEGER,
  CONSTRAINT lender_id PRIMARY KEY (lender_id)
);

CREATE TABLE IF NOT EXISTS rates(
  rate_id INTEGER NOT NULL AUTO_INCREMENT,
  zip_code VARCHAR(10),
  apr DECIMAL(5,3),
  term TINYINT,
  loan_type VARCHAR(5),
  cost_low INTEGER,
  cost_high INTEGER,
  down_payment_min DECIMAL(4,1),
  credit_min SMALLINT,
  lender_id INTEGER,
  origination_year YEAR,
  FOREIGN KEY (zip_code) REFERENCES zips(zip_code),
  FOREIGN KEY (lender_id) REFERENCES lenders(lender_id),
  CONSTRAINT rate_id PRIMARY KEY (rate_id)
);