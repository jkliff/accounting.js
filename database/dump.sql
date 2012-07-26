SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE SCHEMA accounting_js;

SET search_path = accounting_js, pg_catalog;

SET default_with_oids = false;

CREATE TABLE record (
    r_id                serial PRIMARY KEY,
    r_title             text,
    r_description       text,
    r_locality          text,
    r_value             text,
    r_time_registered   text
);

