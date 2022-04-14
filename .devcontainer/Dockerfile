# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
FROM ghcr.io/nuvolaris/nuvolaris-devkit:0.2.0-trinity.22030813
RUN  wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add - ;\
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list ;\
sudo apt-get update ;\
sudo apt-get install -y mongodb-org
ENTRYPOINT ["sudo", "-u", "mongodb", "/usr/bin/mongod", "--config", "/etc/mongod.conf"]
