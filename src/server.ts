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
  OPCUAServer,
  ServerState,
  coerceLocalizedText,
  OPCUAServerEndPoint
} from 'node-opcua';

import { InstallPubSubOptions, installPubSub } from "node-opcua-pubsub-server";
import { constructMqttJsonPubSubConfiguration } from "./pubsub"

import { green, yellow, red } from './utils/log';
import { config } from './config';
import { createAddressSpace } from './addressspace';

const server = new OPCUAServer(config)
  .on('serverRegistered', () => {
    green(' serverRegistered! ');
  })
  .on('serverUnregistered', () => {
    red(' serverUnregistered! ');
  })
  .on('serverRegistrationRenewed', () => {
    green(' serverRegistrationRenewed! ');
  })
  .on('serverRegistrationPending', () => {
    yellow(' serverRegistrationPending! ');
  })
  .on('connectionRefused', (socketData: any, endpoint: OPCUAServerEndPoint) => {
    red(' connectionRefused!');
  })
  .on('openSecureChannelFailure', (socketData: any, channelData: any, endpoint: OPCUAServerEndPoint) => {
    red(' openSecureChannelFailure!');
  });

const shutDown = (): void => {
  if (server.engine.serverStatus.state === ServerState.Shutdown) {
    yellow(` Server shutdown already requested... shutdown will happen in ${server.engine.serverStatus.secondsTillShutdown} second`);
    return;
  }
  yellow(' Received server interruption from user ');
  yellow(' shutting down ...');
  const reason = coerceLocalizedText('Shutdown by administrator');
  reason ? server.engine.serverStatus.shutdownReason = reason : null;
  server.shutdown(10000, () => {
    yellow(' shutting down completed ');
    yellow(' done ');
    process.exit(0);
  });
};

const startUp = async (server: OPCUAServer): Promise<void> => {
  await server.start();
  green(' server started and ready on: ');
  green(` |--> ${server.getEndpointUrl()} `);
  green(` AlternateHostnames: ${config.alternateHostname} `);
  green(' CTRL+C to stop ');
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
};

(async () => {
  try {
    yellow(' starting server... ');
    await server.initialize();
    await createAddressSpace(server);
    server.engine.addressSpace?.installAlarmsAndConditionsService();
    installPubSub( server, {
      // configuration: PubSubConfigurationDataTypeOptions;
      // configurationFile?: string;
      configuration: constructMqttJsonPubSubConfiguration("mqtt://broker.hivemq.com:1883"),
    } as InstallPubSubOptions)
    await startUp(server);
  } catch (error) {
    red(` error: ${error}`);
    process.exit(-1);
  }
})();
