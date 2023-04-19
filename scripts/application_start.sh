#!/bin/bash

sudo chown -R ubuntu:ubuntu /home/ubuntu/fleet-management/services/main
cd /home/ubuntu/fleet-management/services/main

if pm2 restart fm-serv; then
  echo "FLEET MANANGEMENT SERVICE RESTARTED SUCCESSFULLY"
else
  pm2 start dist/index.js --name fm-serv
  echo "FLEET MANANGEMENT SERVICE STARTED SUCCESSFULLY"
fi
