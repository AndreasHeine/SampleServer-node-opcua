// Copyright 2021 (c) Andreas Heine
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

import { writeFileSync } from 'fs'
import { createHash } from 'crypto';

export interface User {
  username: string;
  password: string;
  roles: string;
}

export class UserFile {
  private userList: User[] = [];

  constructor(userList: User[] = []) {
    this.userList = userList;
  }

    public addUser(user: User): void {
        this.userList.push(Object.freeze({
            username: user.username,
            roles: user.roles,
            password: createHash("sha512").update(user.password).digest("hex")
        }))
    }

  public createUserFile(path: string): void {
    writeFileSync(
      path,
      JSON.stringify({
        users: this.userList,
      }),
    );
  }
}
