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
    ServerSecureChannelLayer,
} from 'node-opcua'
import { green, yellow, red } from './../utils/log'

(async () => {
    try {
        const lds = new OPCUADiscoveryServer({ port: 4840 })
        .on("newChannel", (channel: ServerSecureChannelLayer, endpoint: OPCUAServerEndPoint) => {
            yellow(` newChannel! ChannelId:${channel.channelId} - ${channel.remoteAddress}:${channel.remotePort} `)
        })
        .on("closeChannel", (channel: ServerSecureChannelLayer, endpoint: OPCUAServerEndPoint) => {
            yellow(` closeChannel! ChannelId:${channel.channelId} - ${channel.remoteAddress}:${channel.remotePort} `)
        })
        .on("connectionRefused", (socketData: any, endpoint: OPCUAServerEndPoint) => {
            red(` connectionRefused!`)
            red(` |--> socketData: ${socketData}`)
            red(` |--> endpoint: ${endpoint}`)
        })
        .on("openSecureChannelFailure", (socketData: any, channelData: any, endpoint: OPCUAServerEndPoint) => {
            red(` openSecureChannelFailure!`)
            red(` |--> socketData: ${socketData}`)
            red(` |--> channelData: ${channelData}`)
            red(` |--> endpoint: ${endpoint}`)
        })
        .on("error", (e) => {
            red(e)
        })
        .on("debug", (e) => {
            yellow(e)
        })
        yellow(' starting server... ')
        await lds.start()
        green(' DiscoveryServer is running! ')
    } catch (error) {
        red(` error: ${error}`)
        process.exit(-1)
    }
})()