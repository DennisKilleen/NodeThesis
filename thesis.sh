#!/bin/bash

#description "Node.js server"
#author "Dennis Killeen"

cd /../
cd /thesis/NodeThesis/server/
node app.js &
firefox localhost:8080 &
