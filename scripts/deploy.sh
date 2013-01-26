#!/bin/bash

if [[ $# -lt 1 ]] ; then
    echo "missing ssh login param (foo@bar)"
    exit -1
fi

echo 'Starting accounting.js install';

if [[ $2 == 'with-db' ]] ; then
    echo 'Will bootstrap DB (development only)'
    DB=true
fi

ssh $1 <<EOF
[[ ! -d ~/apps/accounting.js ]] && mkdir -p ~/apps/accounting.js
[[ ! -d ~/scripts ]] && mkdir -p ~/scripts
[[ ! -d ~/bin ]] && mkdir -p ~/bin
[[ ! -d ~/apps/pgcrud ]] && \
    cd ~/apps/ && \
    git clone git://github.com/jkliff/pgcrud.git
[[ ! -e ~/bin/pgcrud.py ]] && \
    echo 'Creating link to pgcrud' && \
    cd ~/bin && \
    ln -s ../apps/pgcrud/src/pgcrud.py .
e=\$(netstat -lnp | grep 15233) && [[ \${#e} -gt 0 ]] && e=\${e##*LISTEN} && echo \${e%%/*} | xargs kill -9
EOF

FILES="src www"
[[ $DB == true ]] && FILES="$FILES database"

scp -r $FILES $1:"~/apps/accounting.js"
scp scripts/start_accounting.sh $1:"~/scripts"

if [[ $DB == true ]] ; then

    ssh $1 << EOF
find ~/apps/accounting.js/database/ -name *sql | sort -u | xargs cat | PGPASSWORD=postgres psql -h localhost -U postgres

EOF


fi

ssh $1 << EOF
~/scripts/start_accounting.sh
EOF
