SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE SCHEMA accounting;

SET search_path = accounting, public;

SET default_with_oids = false;

CREATE TABLE accounting.expense (
    e_id                serial PRIMARY KEY,
    e_title             text,
    e_description       text,
    e_locality          text,
    e_value             text not null,
    e_created           timestamp not null default now(),
    e_last_modified     timestamp
);

