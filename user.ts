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

import chalk from 'chalk'
import { readFileSync } from 'fs'
import { compare } from 'bcrypt'
import { User } from './utils/userfile'

const userFile: string = process.env.USERFILE || 'example_user.json'

const userList: User[] = JSON.parse(
        readFileSync(userFile, 'utf-8')
    ).users

const getUser = (username: String, users: User[]): User | null => {
    let user: User[] = users.filter(item => {
        if (item.username === username) {
            return item
        }
        return null
    }) 
    return user[0]
}

export const isValidUserAsync = (username: string, password: string, callback:(err: Error | null, isAuthorized?: boolean) => void) => {
    const user = getUser(username, userList)
    if (user) {
        compare(password, String(user.password), (err, result) => {
            if (result === true) {
                console.log(chalk.green(` user:${user.username} logged in! `))
                callback(null, true)
            } else {
                console.log(chalk.red(` user:${user.username} rejected! `))
                callback(null, false)
            }
        })
    } else {
        console.log(chalk.red(` user:unknown rejected! `))
        callback(null, false)
    }
}

export const getUserRole = (username: String) => {
    return getUser(username, userList)?.role || 'unknown'
}