// Copyright 2021 (c) Andreas Heine
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import { 
    MessageSecurityMode, 
    SecurityPolicy,
    ServerCapabilities,
    OperationLimits,
    OPCUAServerOptions,
    OPCUACertificateManager,
} from "node-opcua"
import { readFileSync } from 'fs'
import { hash, hashSync, genSaltSync } from 'bcrypt'

const port = Number(process.env.PORT) || 4840
const ip = process.env.IP || "0.0.0.0"
const userFile = process.env.USERFILE || "example_user.json"
const salt = process.env.SALT || genSaltSync()

interface User {
    username: String,
    password: String,
    role: "admin" | "operator" | "guest" // basic roles defined by spec.
}

const userList:User[] = JSON.parse(
        readFileSync(userFile, "utf-8")
    ).users.map((user: User) => {
        user.username = user.username,
        user.password = hashSync(String(user.password), salt),
        user.role = user.role
        return user
    })

const getUser = (username: String, users: User[]):User | null => {
    let user:User[] = users.filter(item => {
        if (item.username === username) {
            return item
        }
        return null
    }) 
    return user[0]
}

const userManager = {
    // // blocks eventloop !!!
    // isValidUser: (username: string, password: string) => {
    //     if (getUser(username, userList)?.password === hashSync(String(password), salt)) {
    //         return true
    //     }
    //     return false
    // },
    getUserRole: (username: string) => {
        return getUser(username, userList)?.role || "unknown"
    },
    isValidUserAsync: (username: string, password: string, callback:(err: Error | null, isAuthorized?: boolean) => void) => {
        const user = getUser(username, userList)
        // check if username exist -> avoid hashing passwords for invalid usernames
        if (user) {
            hash(String(password), salt)
            .then(hash => {
                if (user?.password === hash) {
                    callback(null, true)
                }
                callback(null, false)
            })
            .catch((err) => {
                callback(null, false)
            })
        } else {
            callback(null, false)
        }
    }
}

const serverCertificateManager = new OPCUACertificateManager({
    automaticallyAcceptUnknownCertificate: true,
    name: "pki",
    rootFolder: "pki"
})

export const config: OPCUAServerOptions = {
    port: port,
    hostname: ip,
    maxAllowedSessionNumber: 100,
    maxConnectionsPerEndpoint: 100,
    timeout: 10000,
    resourcePath: "/UA",
    buildInfo: {
        productUri: "SampleServer-productUri",
        productName: "SampleServer-productName",
        manufacturerName: "SampleServer-manufacturerName",
        buildNumber: "v1.0.0",
        buildDate: new Date(),
    },
    serverInfo: {
        applicationName: { 
            text: "SampleServer-applicationName", 
            locale: "en" ,
        },
        applicationUri: "urn:SampleServer",
        productUri: "SampleServer-productUri",
    },
    serverCapabilities: new ServerCapabilities({
        maxBrowseContinuationPoints: 10,
        maxArrayLength: 1000,
        minSupportedSampleRate: 100,
        operationLimits: new OperationLimits({
            maxMonitoredItemsPerCall: 1000,
            maxNodesPerBrowse: 1000,
            maxNodesPerRead: 1000,
            maxNodesPerRegisterNodes: 1000,
            maxNodesPerTranslateBrowsePathsToNodeIds: 1000,
            maxNodesPerWrite: 1000,
        })
    }),
    allowAnonymous: false,
    userManager: userManager,
    serverCertificateManager: serverCertificateManager,
    securityModes: [
        MessageSecurityMode.None, 
        MessageSecurityMode.SignAndEncrypt
    ],
    securityPolicies: [
        SecurityPolicy.None, 
        SecurityPolicy.Basic256Sha256
    ],
    disableDiscovery: false,
    nodeset_filename: [
        // nodesets
        "nodesets/Opc.Ua.NodeSet2.xml", 
        "nodesets/Opc.Ua.Di.NodeSet2.xml", 
        "nodesets/Opc.Ua.Machinery.NodeSet2.xml",
        "nodesets/Opc.Ua.IA.NodeSet2.xml",
        "nodesets/Opc.Ua.MachineTool.NodeSet2.xml",
        "nodesets/Opc.Ua.PlasticsRubber.GeneralTypes.NodeSet2.xml",
        "nodesets/Opc.Ua.PlasticsRubber.IMM2MES.NodeSet2.xml",
        // models
        "machines/machinetool/model/ShowCaseMachineTool.xml",
        "machines/sample_imm/model/sample_imm.xml",
    ],
}
