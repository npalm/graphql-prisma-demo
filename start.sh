#!/usr/bin/env sh

notinstalled() { printf "ERROR: %s not installed \n" "$*" >&2; }

docker -v &>/dev/null || {
    notinstalled docker
    ERROR=1
}

docker-compose -v &>/dev/null || {
    notinstalled docker-compose
    ERROR=1
}

npm -v &>/dev/null || {
    notinstalled npm
    ERROR=1
}

node -v &>/dev/null || {
    notinstalled node
    ERROR=1
}

if [[ ! -z $ERROR ]]; then
    exit 1
fi

docker-compose up -d
printf "%s\n" "Waiting 10 seconds before invoking deploy. Hopefully docker services are up."
sleep 10
npm install
npm run deploy-cities
npm run deploy-talks
