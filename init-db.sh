#!/bin/bash

echo "Installing pggram"
psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS pggram;"
