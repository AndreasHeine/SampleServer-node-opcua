// SPDX-License-Identifier: Apache-2.0
//
// Copyright (c) 2021-2024 Andreas Heine
//
//   Licensed under the Apache License, Version 2.0 (the 'License');
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an 'AS IS' BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import { readFileSync } from "fs";
import yargs from "yargs";
import { NodeId, makeRoles } from "node-opcua";
const sha2 = require("@noble/hashes/sha2.js");
import { User } from "./utils/userfile";
import { green, red } from "./utils/log";

const argv = yargs(process.argv.slice(2))
  .options({
    ip: { type: "string" },
    port: { type: "number" },
    configpath: { type: "string" },
  })
  .parseSync();

const configPath: string = process.env.CONFIGPATH || argv.configpath || "";
const userFile: string = "user.json";

const userList: User[] = Object.freeze(
  JSON.parse(readFileSync(configPath + userFile, "utf-8")).users,
);

const getUser = (username: string, users: User[]): User | null => {
  const user: User[] = users.filter((item) => {
    if (item.username === username) {
      return item;
    }
    return null;
  });
  if (user.length > 1) {
    red(` Found ${user.length} Users with the Name ${username} `);
    return null;
  }
  return user[0];
};

export const isValidUserAsync = (
  username: string,
  password: string,
  callback: (err: Error | null, isAuthorized?: boolean) => void,
) => {
  const user = getUser(username, userList);
  if (user) {
    const hash = Buffer.from(
      sha2.sha512(new TextEncoder().encode(user.password)),
    ).toString("hex");
    if (hash === user.password) {
      green(` User:'${user.username}' logged in as '${user.roles}'! `);
      callback(null, true);
    } else {
      red(` User:'${user.username}' rejected! `);
      callback(null, false);
    }
  } else {
    red(" User:unknown rejected! ");
    callback(null, false);
  }
};

export const getUserRoles = (username: string): NodeId[] => {
  return makeRoles(getUser(username, userList)?.roles || "");
};
