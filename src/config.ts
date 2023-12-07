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

const configPath: string = process.env.CONFIGPATH || argv.configpath || '';
const configFile: string = 'configuration.json';

let configJsonObj: OPCUAServerOptions;
try {
  const configString = readFileSync(configPath + configFile, 'utf-8');
  configJsonObj = JSON.parse(configString) || {};
} catch (error) {
  red(`Error while loading file: ${configFile} -> ${error}`);
  configJsonObj = {};
};

const packageString: string = readFileSync('package.json', 'utf-8');
const packageJsonObj = JSON.parse(packageString) || {};

let config: OPCUAServerOptions = {};

config.hostname = process.env.IP || argv.ip || configJsonObj.hostname || '127.0.0.1';

if (!configJsonObj.port) {
  config.port = Number(process.env.PORT) || argv.port || 4840;
} else {
  config.port = Number(process.env.PORT) || argv.port || configJsonObj.port;
};

if (config.port != 4840) {
  config.registerServerMethod = RegisterServerMethod.LDS;
  // config.registerServerMethod = RegisterServerMethod.MDNS;
} else {
  config.registerServerMethod = RegisterServerMethod.HIDDEN;
};

//process.env.HOSTNAMES = "opcua3.umati.app"

config.alternateHostname = process.env.HOSTNAMES?.split(",") || configJsonObj.alternateHostname || [];
// config.alternateEndpoints = configJsonObj.alternateEndpoints || [];
config.maxConnectionsPerEndpoint = configJsonObj.maxConnectionsPerEndpoint || 100;
config.timeout = configJsonObj.timeout || 10000;
config.resourcePath = configJsonObj.resourcePath || '/UA';
config.allowAnonymous = configJsonObj.allowAnonymous || true;
config.disableDiscovery = configJsonObj.disableDiscovery || true;
config.discoveryServerEndpointUrl = configJsonObj.discoveryServerEndpointUrl || 'opc.tcp://127.0.0.1:4840';
config.nodeset_filename = configJsonObj.nodeset_filename || [];
config.isAuditing = configJsonObj.isAuditing || false;
// https://github.com/node-opcua/node-opcua/blob/master/packages/node-opcua-service-discovery/source/server_capabilities.ts
// http://www.opcfoundation.org/UA/schemas/1.04/ServerCapabilities.csv
config.capabilitiesForMDNS = configJsonObj.capabilitiesForMDNS || ['NA'];
config.defaultSecureTokenLifetime = configJsonObj.defaultSecureTokenLifetime || 300000;

// BuildInfo
config.buildInfo = {};
config.buildInfo.productUri = configJsonObj.buildInfo?.productUri || 'SampleServer-productUri';
config.buildInfo.productName = configJsonObj.buildInfo?.productName || 'SampleServer-productName';
config.buildInfo.manufacturerName = configJsonObj.buildInfo?.manufacturerName || 
'SampleServer-manufacturerName';
config.buildInfo.buildNumber = configJsonObj.buildInfo?.buildNumber || 'v1.0.0';
config.buildInfo.buildDate = new Date(String(configJsonObj.buildInfo?.buildDate)) || new Date();
config.buildInfo.softwareVersion = `node-opcua: ${packageJsonObj.dependencies['node-opcua']}`;

// ServerInfo
const applicationName = 'SampleServer-applicationName';
config.serverInfo = {};
config.serverInfo.applicationName = configJsonObj.serverInfo?.applicationName || {
  'text': applicationName,
  'locale': 'en-US'
};
config.serverInfo.applicationUri = configJsonObj.serverInfo?.applicationUri || 'urn:SampleServer';
config.serverInfo.productUri = configJsonObj.serverInfo?.productUri || 'SampleServer-productUri';
config.serverInfo.applicationType = configJsonObj.serverInfo?.applicationType || ApplicationType.Server;
config.serverInfo.gatewayServerUri = configJsonObj.serverInfo?.gatewayServerUri || '';
config.serverInfo.discoveryProfileUri = configJsonObj.serverInfo?.discoveryProfileUri || '';
config.serverInfo.discoveryUrls = configJsonObj.serverInfo?.discoveryUrls || [];

// ServerCapabilities and OperationLimits
const operationLimits = configJsonObj.serverCapabilities?.operationLimits;
config.serverCapabilities = new ServerCapabilities({
  maxSessions: configJsonObj.serverCapabilities?.maxSessions || 100,
  localeIdArray: configJsonObj.serverCapabilities?.localeIdArray || ["en-Us"],
  maxBrowseContinuationPoints: configJsonObj.serverCapabilities?.maxBrowseContinuationPoints || 10,
  maxArrayLength: configJsonObj.serverCapabilities?.maxArrayLength || 1000,
  // minSupportedSampleRate: configJsonObj.serverCapabilities?.minSupportedSampleRate || 100,
  // maxByteStringLength: configJsonObj.serverCapabilities?.maxByteStringLength || undefined,
  // maxStringLength: configJsonObj.serverCapabilities?.maxStringLength || undefined,
  maxHistoryContinuationPoints: configJsonObj.serverCapabilities?.maxHistoryContinuationPoints || 10,
  operationLimits: ({
    maxMonitoredItemsPerCall: operationLimits?.maxMonitoredItemsPerCall || 1000,
    maxNodesPerBrowse: operationLimits?.maxNodesPerBrowse || 1000,
    maxNodesPerHistoryReadData: operationLimits?.maxNodesPerHistoryReadData || 1000,
    maxNodesPerHistoryReadEvents: operationLimits?.maxNodesPerHistoryReadEvents || 1000,
    maxNodesPerHistoryUpdateData: operationLimits?.maxNodesPerHistoryUpdateData || 1000,
    maxNodesPerHistoryUpdateEvents: operationLimits?.maxNodesPerHistoryUpdateEvents || 1000,
    maxNodesPerMethodCall: operationLimits?.maxNodesPerMethodCall || 100,
    maxNodesPerNodeManagement: operationLimits?.maxNodesPerNodeManagement || 100,
    maxNodesPerRead: operationLimits?.maxNodesPerRead || 1000,
    maxNodesPerRegisterNodes: operationLimits?.maxNodesPerRegisterNodes || 1000,
    maxNodesPerTranslateBrowsePathsToNodeIds: operationLimits?.maxNodesPerTranslateBrowsePathsToNodeIds || 1000,
    maxNodesPerWrite: operationLimits?.maxNodesPerWrite || 1000,

  } as OperationLimits),
  // https://profiles.opcfoundation.org/v104/Reporting/
  // https://reference.opcfoundation.org/v104/Core/docs/Part7/6.2/
  serverProfileArray: configJsonObj.serverCapabilities?.serverProfileArray || [], 
  softwareCertificates: [], // To Do! create SignedSoftwareCertificate[] from string[]
});

const userManager = {
  isValidUserAsync: isValidUserAsync,
  getUserRoles: getUserRoles
};

config.userManager = userManager;

OPCUACertificateManager.defaultCertificateSubject = `/CN=${applicationName}@${config.hostname}/ST=HE/OU=E/DC=${config.alternateHostname}/O=Umati/L=Frankfurt/C=DE`

const serverCertificateManager = new OPCUACertificateManager({
  automaticallyAcceptUnknownCertificate: true,
  name: 'PKI',
  rootFolder: './pki',
  keySize: 2048
});

// const serverCertFile = './pki/own/certs/server_cert.pem';
// const serverPrivatKeyFile = './pki/own/private/private_key.pem';

// config.certificateFile = serverCertFile;
// config.privateKeyFile = serverPrivatKeyFile;

const userCertificateManager = new OPCUACertificateManager({
  automaticallyAcceptUnknownCertificate: false,
  name: 'UserPKI',
  rootFolder: './user_pki',
  keySize: 2048
});

config.userCertificateManager = userCertificateManager;
config.serverCertificateManager = serverCertificateManager;

config.securityModes = [
  MessageSecurityMode.None,
  MessageSecurityMode.Sign,
  MessageSecurityMode.SignAndEncrypt
];

config.securityPolicies = [
  SecurityPolicy.None,
  SecurityPolicy.Basic128Rsa15,
  SecurityPolicy.Basic256Sha256
];

export { config };