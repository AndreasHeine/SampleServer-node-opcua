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

import { readFileSync } from 'fs';
import yargs from 'yargs';
import {
  MessageSecurityMode,
  SecurityPolicy,
  ServerCapabilities,
  OperationLimits,
  ApplicationType,
  OPCUAServerOptions,
  OPCUACertificateManager,
  RegisterServerMethod
} from 'node-opcua';
import { isValidUserAsync, getUserRoles } from './user';
import { red } from './utils/log';

const argv = yargs(process.argv.slice(2)).options({
  ip: { type: 'string' },
  port: { type: 'number' },
  configpath: { type: 'string' }
}).parseSync();

const configPath: string = process.env.CONFIGPATH || argv.configpath || "";
const configFile: string = "configuration.json";

let configJsonObj: OPCUAServerOptions;
try {
  const configString = readFileSync(configPath + configFile, "utf-8");
  configJsonObj = JSON.parse(configString) || {};
} catch (error) {
  red(`Error while loading config-file: ${error}`);
  configJsonObj = {};
};

const packageString: string = readFileSync("package.json", "utf-8");
const packageJsonObj = JSON.parse(packageString) || {};

let config: OPCUAServerOptions = {};

config.hostname = process.env.IP || argv.ip || configJsonObj.hostname || "127.0.0.1";

if (!configJsonObj.port) {
  config.port = Number(process.env.PORT) || argv.port || 4840;
} else {
  config.port = Number(process.env.PORT) || argv.port || configJsonObj.port;
};

if (config.port != 4840) {
  config.registerServerMethod = RegisterServerMethod.LDS;
} else {
  config.registerServerMethod = RegisterServerMethod.HIDDEN;
};

config.alternateHostname = configJsonObj.alternateHostname || [];
config.alternateEndpoints = configJsonObj.alternateEndpoints || [];
config.maxAllowedSessionNumber = configJsonObj.maxAllowedSessionNumber || 100;
config.maxConnectionsPerEndpoint = configJsonObj.maxConnectionsPerEndpoint || 100;
config.timeout = configJsonObj.timeout || 10000;
config.resourcePath = configJsonObj.resourcePath || "/UA";
config.buildInfo = {};
config.buildInfo.productUri = configJsonObj.buildInfo?.productUri || 'SampleServer-productUri';
config.buildInfo.productName = configJsonObj.buildInfo?.productName || 'SampleServer-productName';
config.buildInfo.manufacturerName = configJsonObj.buildInfo?.manufacturerName || 
'SampleServer-manufacturerName';
config.buildInfo.buildNumber = configJsonObj.buildInfo?.buildNumber || 'v1.0.0';
config.buildInfo.buildDate = new Date(String(configJsonObj.buildInfo?.buildDate)) || new Date();
config.buildInfo.softwareVersion = `node-opcua: ${packageJsonObj.dependencies["node-opcua"] || "latest"}`;
config.serverInfo = {};
config.serverInfo.applicationName = configJsonObj.serverInfo?.applicationName || {
  "text": "SampleServer-applicationName",
  "locale": "en-US"
};
config.serverInfo.applicationUri = configJsonObj.serverInfo?.applicationUri || "urn:SampleServer";
config.serverInfo.productUri = configJsonObj.serverInfo?.productUri || "SampleServer-productUri";
config.serverInfo.applicationType = configJsonObj.serverInfo?.applicationType || ApplicationType.Server;
config.serverInfo.gatewayServerUri = configJsonObj.serverInfo?.gatewayServerUri || "";
config.serverInfo.discoveryProfileUri = configJsonObj.serverInfo?.discoveryProfileUri || "";
config.serverInfo.discoveryUrls = configJsonObj.serverInfo?.discoveryUrls || []
const operationLimits = configJsonObj.serverCapabilities?.operationLimits;
config.serverCapabilities = new ServerCapabilities({
  maxBrowseContinuationPoints: configJsonObj.serverCapabilities?.maxBrowseContinuationPoints || 10,
  maxArrayLength: configJsonObj.serverCapabilities?.maxArrayLength || 1000,
  minSupportedSampleRate: configJsonObj.serverCapabilities?.minSupportedSampleRate || 100,
  operationLimits: new OperationLimits({
    maxMonitoredItemsPerCall: operationLimits?.maxMonitoredItemsPerCall || 1000,
    maxNodesPerBrowse: operationLimits?.maxNodesPerBrowse || 1000,
    maxNodesPerRead: operationLimits?.maxNodesPerRead || 1000,
    maxNodesPerRegisterNodes: operationLimits?.maxNodesPerRegisterNodes || 1000,
    maxNodesPerTranslateBrowsePathsToNodeIds: operationLimits?.maxNodesPerTranslateBrowsePathsToNodeIds || 1000,
    maxNodesPerWrite: operationLimits?.maxNodesPerWrite || 1000
  })
});
config.allowAnonymous = configJsonObj.allowAnonymous || true;
config.disableDiscovery = configJsonObj.disableDiscovery || true;
config.certificateFile = configJsonObj.certificateFile || undefined
config.privateKeyFile = configJsonObj.privateKeyFile || undefined
config.nodeset_filename = configJsonObj.nodeset_filename || []

const userManager = {
  isValidUserAsync: isValidUserAsync,
  getUserRoles: getUserRoles
};

config.userManager = userManager;

const serverCertificateManager = new OPCUACertificateManager({
  automaticallyAcceptUnknownCertificate: true,
  name: 'pki',
  rootFolder: './pki'
});

const userCertificateManager = new OPCUACertificateManager({
  automaticallyAcceptUnknownCertificate: false,
  name: 'user_pki',
  rootFolder: './user_pki'
});

config.userCertificateManager = userCertificateManager;
config.serverCertificateManager = serverCertificateManager;

config.securityModes = [
  MessageSecurityMode.None,
  MessageSecurityMode.SignAndEncrypt
]

config.securityPolicies = [
  SecurityPolicy.None,
  SecurityPolicy.Basic256Sha256
]

export { config };