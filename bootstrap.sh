#!/bin/bash

ROLE=$1

PSQL="psql -h localhost -p 5432 -U $ROLE "
DB=accounting_js_dev

$PSQL postgres  -f database/01_database.sql
$PSQL $DB       -f database/02_schema.sql
