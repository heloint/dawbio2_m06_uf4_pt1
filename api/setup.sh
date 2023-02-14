#!/bin/bash

npm init

npm install -y body-parser express mysql cors multer jsonwebtoken --save
sudo npm install -g -y nodemon

sed -i '/"scripts"/a  \ \ \ \ "start": "nodemon index.js",' package.json

# If the mysql package cannot connect via TCP protocol.

# Install this.
# sudo apt install libmysqlclient-dev

# Get the socket default path.
# mysql_config --socket
