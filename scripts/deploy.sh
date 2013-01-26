if [[ ! $# -eq 1 ]] ; then
    echo "missing ssh login param (foo@bar)"
    exit -1
fi

ssh $1 <<EOF
[[ ! -d ~/apps/accounting.js ]] && mkdir -p ~/apps/accounting.js
[[ ! -d ~/scripts ]] && mkdir -p ~/scripts
EOF

scp -r src www $1:"~/apps/accounting.js"
scp scripts/start_accounting.sh $1:"~/scripts"
