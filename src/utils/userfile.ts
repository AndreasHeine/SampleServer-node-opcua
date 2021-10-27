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
import { hashSync, genSaltSync } from 'bcrypt'

export interface User {
    username: String,
    password: String,
    role: 'admin' | 'operator' | 'guest'
}

export class UserFile {
    private userList: User[] = []

    constructor(userList: User[] = []) {
        this.userList = userList;
      }

    public addUser(user: User): void {
        this.userList.push(Object.freeze({
            username: user.username,
            role: user.role,
            password: hashSync(String(user.password), genSaltSync())
        }))
    }

    public createUserFile(path: string): void {
        writeFileSync(path, JSON.stringify({
            users: this.userList
        }))
    }
}

// const exampleUserFile = new UserFile()
// exampleUserFile.addUser({
//     username: 'admin',
//     password: 'pw1',
//     role: 'admin'
// })
// exampleUserFile.addUser({
//     username: 'operator',
//     password: 'pw2',
//     role: 'operator'
// })
// exampleUserFile.addUser({
//     username: 'guest',
//     password: 'pw3',
//     role: 'guest'
// })
// exampleUserFile.createUserFile('./../example_user.json')