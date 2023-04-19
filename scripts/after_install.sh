#!/bin/bash
# Set Environments variables
# Check if the file cloud.env exists or return error
if [ -f "/home/ubuntu/fleet-management/services/main/scripts/cloud.env" ]; then
  cp "/home/ubuntu/fleet-management/services/main/scripts/cloud.env" "/home/ubuntu/fleet-management/services/main/.env"
else
  echo "cloud.env not found"
  exit 1
fi

# Check if global.env exists else return error
if [ -f "/etc/profile" ]; then
  source "/etc/profile"
else
  echo "global /etc/profile not found"
  exit 1
fi

# Replace sed_secret and sed_salt to random string
# sed -i "s/sed_salt/$(openssl rand -hex 32)/g" /home/ubuntu/fleet-management/services/main/.env
sed -i "s/sed_secret/$SECRET/g" /home/ubuntu/fleet-management/services/main/.env

sed -i "s/node_env/$NODE_ENV/g" /home/ubuntu/fleet-management/services/main/.env

# Set Application Full Qualified Domain Name
sed -i "s+app_common_name+$FLEET_MANAGEMENT_APP_COMMON_NAME+g" /home/ubuntu/fleet-management/services/main/.env

# Replace mongodb_db_user and mongodb_db_pass to envirnment variable value
sed -i "s+mongo_db_host+$MONGO_DB_HOST+g" /home/ubuntu/fleet-management/services/main/.env
sed -i "s+mongo_db_port+$MONGO_DB_PORT+g" /home/ubuntu/fleet-management/services/main/.env
sed -i "s+mongo_db_user+$FLEET_MANAGEMENT_MONGO_DB_USER+g" /home/ubuntu/fleet-management/services/main/.env
sed -i "s+mongo_db_pass+$FLEET_MANAGEMENT_MONGO_DB_PASS+g" /home/ubuntu/fleet-management/services/main/.env
sed -i "s+mongo_db_name+$FLEET_MANAGEMENT_MONGO_DB_NAME+g" /home/ubuntu/fleet-management/services/main/.env

# Mails password
sed -i "s+mail_pass_info+$MAIL_PASS+g" /home/ubuntu/fleet-management/services/main/.env

