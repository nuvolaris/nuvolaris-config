FROM ghcr.io/nuvolaris/nuvolaris-devkit:neo-22.0103.09
RUN  wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add - ;\
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list ;\
sudo apt-get update ;\
sudo apt-get install -y mongodb-org
ENTRYPOINT ["sudo", "-u", "mongodb", "/usr/bin/mongod", "--config", "/etc/mongod.conf"]
