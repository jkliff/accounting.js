#!/bin/bash

HOSTNAME=$1
PORT=$2
ROLE=$3

PSQL="psql -h $HOSTNAME -p $PORT "
DB=accounting

$PSQL postgres  -f database/01_database.sql
echo "grant all privileges on database $DB to $ROLE" | $PSQL postgres
$PSQL $DB -U $ROLE -f database/02_schema.sql
