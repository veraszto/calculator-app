#! /bin/bash
docker pull mongo
docker container create --publish 27017:27017 --name calculator-mongodb mongo
docker container start calculator-mongodb
