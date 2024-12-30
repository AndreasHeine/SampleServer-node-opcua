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

import {
  OPCUADiscoveryServer,
  OPCUAServerEndPoint,
  ServerSecureChannelLayer,
  OPCUACertificateManager,
} from "node-opcua";
import { OPCUADiscoveryServerOptions } from "node-opcua-server-discovery";

import { green, yellow, red } from "./../utils/log";

(async () => {
  try {
    const config: OPCUADiscoveryServerOptions = {
      port: 4840,
      serverCertificateManager: new OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        name: "discovery_pki",
        rootFolder: "discovery_pki",
      }),
      serverInfo: {
        applicationName: {
          text: "SampleDiscoveryServer-applicationName",
          locale: "en",
        },
        applicationUri: "urn:SampleDiscoveryServer",
        productUri: "SampleDiscoveryServer-productUri",
      },
    };
    const lds = new OPCUADiscoveryServer(config)
      .on(
        "newChannel",
        (channel: ServerSecureChannelLayer, endpoint: OPCUAServerEndPoint) => {
          green(
            ` DiscoveryServer: newChannel! ChannelId:${channel.channelId} - ${channel.remoteAddress}:${channel.remotePort} `,
          );
        },
      )
      .on(
        "closeChannel",
        (channel: ServerSecureChannelLayer, endpoint: OPCUAServerEndPoint) => {
          green(
            ` DiscoveryServer: closeChannel! ChannelId:${channel.channelId} - ${channel.remoteAddress}:${channel.remotePort} `,
          );
        },
      )
      .on(
        "connectionRefused",
        (socketData: any, endpoint: OPCUAServerEndPoint) => {
          red(` DiscoveryServer: connectionRefused! \n ${endpoint.serverInfo}`);
        },
      )
      .on(
        "openSecureChannelFailure",
        (socketData: any, channelData: any, endpoint: OPCUAServerEndPoint) => {
          red(
            ` DiscoveryServer: openSecureChannelFailure! \n ${channelData} \n ${endpoint.serverInfo}`,
          );
        },
      )
      .on("error", (e) => {
        red(` DiscoveryServer: ${e} `);
      })
      .on("debug", (e) => {
        yellow(` DiscoveryServer: ${e} `);
      });
    yellow(" DiscoveryServer: starting server... ");
    await lds.start();
    green(" DiscoveryServer: is running! ");
  } catch (error) {
    red(` DiscoveryServer error: ${error}`);
    process.exit(-1);
  }
})();
