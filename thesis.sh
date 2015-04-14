#!/bin/bash

#description "Node.js server"
#author "Dennis Killeen"

cd /../
cd /thesis/NodeThesis/server/
node app.js &
sleep 1
firefox localhost:8080 &
firefox localhost:8080 &
