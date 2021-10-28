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

import { readFileSync } from 'fs'
import { compare } from 'bcrypt'

import { 
    NodeId,
    makeRoles
} from 'node-opcua'

import { User } from './utils/userfile'
import { green, red } from './utils/log'

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
    if (user.length > 1) {
        red(` Found ${user.length} Users with the Name ${username} `)
        return null
    }
    return user[0]
}

export const isValidUserAsync = (username: string, password: string, callback:(err: Error | null, isAuthorized?: boolean) => void) => {
    const user = getUser(username, userList)
    if (user) {
        compare(password, String(user.password), (err, result) => {
            if (result === true) {
                green(` user:${user.username} logged in! `)
                callback(null, true)
            } else {
                red(` user:${user.username} rejected! `)
                callback(null, false)
            }
        })
    } else {
        red(` user:unknown rejected! `)
        callback(null, false)
    }
}

// this does not get called at all but its part of the docs:
// https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.usermanageroptions.html
// export const getUserRole = (username: string): string => {
//     const roles = getUser(username, userList)?.role || ""
//     return roles
// }

// this works:
// https://github.com/node-opcua/node-opcua/blob/6ed5227ae39e37af6d0de60c7b89ae66686726b9/packages/node-opcua-address-space/source/session_context.ts#L96
export const getUserRoles = (username: string): NodeId[] => {
    return makeRoles(getUser(username, userList)?.roles || "")
}