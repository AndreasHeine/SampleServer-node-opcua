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

import { 
    OPCUADiscoveryServer, 
    OPCUAServerEndPoint,
} from 'node-opcua'
import chalk from 'chalk'

(async () => {
    try {
        const lds = new OPCUADiscoveryServer({ port: 4840 })
        .on("newChannel", () => {
            console.log(chalk.yellow(` newChannel!`))
        })
        .on("closeChannel", () => {
            console.log(chalk.yellow(` closeChannel!`))
        })
        .on("connectionRefused", (socketData: any, endpoint: OPCUAServerEndPoint) => {
            console.log(chalk.red(` connectionRefused!`))
            console.log(chalk.red(` |--> socketData: ${socketData}`))
            console.log(chalk.red(` |--> endpoint: ${endpoint}`))
        })
        .on("openSecureChannelFailure", (socketData: any, channelData: any, endpoint: OPCUAServerEndPoint) => {
            console.log(chalk.red(` openSecureChannelFailure!`))
            console.log(chalk.red(` |--> socketData: ${socketData}`))
            console.log(chalk.red(` |--> channelData: ${channelData}`))
            console.log(chalk.red(` |--> endpoint: ${endpoint}`))
        })
        console.log(chalk.yellow(' starting server... '))
        await lds.start()
        console.log(chalk.green(' DiscoveryServer is running! '))
    } catch (error) {
        console.log(chalk.red(' error ', error))
        process.exit(-1)
    }
})()