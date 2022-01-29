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
  red(`Error while loading config-file: ${error}`);
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
} else {
  config.registerServerMethod = RegisterServerMethod.HIDDEN;
};

config.alternateHostname = configJsonObj.alternateHostname || [];
config.alternateEndpoints = configJsonObj.alternateEndpoints || [];
config.maxAllowedSessionNumber = configJsonObj.maxAllowedSessionNumber || 100;
config.maxConnectionsPerEndpoint = configJsonObj.maxConnectionsPerEndpoint || 100;
config.timeout = configJsonObj.timeout || 10000;
config.resourcePath = configJsonObj.resourcePath || '/UA';
config.allowAnonymous = configJsonObj.allowAnonymous || true;
config.disableDiscovery = configJsonObj.disableDiscovery || true;
config.discoveryServerEndpointUrl = configJsonObj.discoveryServerEndpointUrl || 'opc.tcp://127.0.0.1:4840';
config.certificateFile = configJsonObj.certificateFile || undefined;
config.privateKeyFile = configJsonObj.privateKeyFile || undefined;
config.nodeset_filename = configJsonObj.nodeset_filename || [];
config.isAuditing = configJsonObj.isAuditing || false;
config.capabilitiesForMDNS = configJsonObj.capabilitiesForMDNS || [];
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
config.serverInfo = {};
config.serverInfo.applicationName = configJsonObj.serverInfo?.applicationName || {
  'text': 'SampleServer-applicationName',
  'locale': 'en-US'
};
config.serverInfo.applicationUri = configJsonObj.serverInfo?.applicationUri || 'urn:SampleServer';
config.serverInfo.productUri = configJsonObj.serverInfo?.productUri || 'SampleServer-productUri';
config.serverInfo.applicationType = configJsonObj.serverInfo?.applicationType || ApplicationType.Server;
config.serverInfo.gatewayServerUri = configJsonObj.serverInfo?.gatewayServerUri || '';
config.serverInfo.discoveryProfileUri = configJsonObj.serverInfo?.discoveryProfileUri || '';
config.serverInfo.discoveryUrls = configJsonObj.serverInfo?.discoveryUrls || []

// ServerCapabilities and OperationLimits
const operationLimits = configJsonObj.serverCapabilities?.operationLimits;
config.serverCapabilities = new ServerCapabilities({
  localeIdArray: configJsonObj.serverCapabilities?.localeIdArray || ["en-Us"],
  maxBrowseContinuationPoints: configJsonObj.serverCapabilities?.maxBrowseContinuationPoints || 10,
  maxArrayLength: configJsonObj.serverCapabilities?.maxArrayLength || 1000,
  minSupportedSampleRate: configJsonObj.serverCapabilities?.minSupportedSampleRate || 100,
  // maxByteStringLength: configJsonObj.serverCapabilities?.maxByteStringLength || undefined,
  // maxStringLength: configJsonObj.serverCapabilities?.maxStringLength || undefined,
  maxHistoryContinuationPoints: configJsonObj.serverCapabilities?.maxHistoryContinuationPoints || 10,
  operationLimits: new OperationLimits({
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

  }),
  serverProfileArray: configJsonObj.serverCapabilities?.serverProfileArray || 
  [
    // 'http://opcfoundation.org/UA-Profile/Server/CoreFacet',
    // 'http://opcfoundation.org/UA-Profile/Server/Core2017Facet',
    // 'http://opcfoundation.org/UA-Profile/Server/SessionLess',
    // 'http://opcfoundation.org/UA-Profile/Server/ReverseConnect',
    // 'http://opcfoundation.org/UA-Profile/Server/Behaviour',
    // 'http://opcfoundation.org/UA-Profile/Server/RequestStateChange',
    // 'http://opcfoundation.org/UA-Profile/Server/SubnetDiscovery',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalCertificateManagement',
    // 'http://opcfoundation.org/UA-Profile/Server/AuthorizationServiceConfiguration',
    // 'http://opcfoundation.org/UA-Profile/Server/KeyCredentialManagement',
    // 'http://opcfoundation.org/UA-Profile/Server/AttributeWriteMask',
    // 'http://opcfoundation.org/UA-Profile/Server/FileAccess',
    // 'http://opcfoundation.org/UA-Profile/Server/Documentation',
    // 'http://opcfoundation.org/UA-Profile/Server/EmbeddedDataChangeSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/StandardDataChangeSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/StandardDataChangeSubscription2017',
    // 'http://opcfoundation.org/UA-Profile/Server/EnhancedDataChangeSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/EnhancedDataChangeSubscription2017',
    // 'http://opcfoundation.org/UA-Profile/Server/DurableSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/DataAccess',
    // 'http://opcfoundation.org/UA-Profile/Server/ComplexTypes',
    // 'http://opcfoundation.org/UA-Profile/Server/ComplexTypes2017',
    // 'http://opcfoundation.org/UA-Profile/Server/StandardEventSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/AddressSpaceNotifier',
    // 'http://opcfoundation.org/UA-Profile/Server/ACBaseCondition',
    // 'http://opcfoundation.org/UA-Profile/Server/ACRefresh2',
    // 'http://opcfoundation.org/UA-Profile/Server/ACAddressSpaceInstance',
    // 'http://opcfoundation.org/UA-Profile/Server/ACEnable',
    // 'http://opcfoundation.org/UA-Profile/Server/ACAlarmMetrics',
    // 'http://opcfoundation.org/UA-Profile/Server/ACAlarm',
    // 'http://opcfoundation.org/UA-Profile/Server/ACAckAlarm',
    // 'http://opcfoundation.org/UA-Profile/Server/ACExclusiveAlarming',
    // 'http://opcfoundation.org/UA-Profile/Server/ACNon-ExclusiveAlarming',
    // 'http://opcfoundation.org/UA-Profile/Server/ACPreviousInstances',
    // 'http://opcfoundation.org/UA-Profile/Server/ACDialog',
    // 'http://opcfoundation.org/UA-Profile/Server/ACCertificateExpiration',
    // 'http://opcfoundation.org/UA-Profile/Server/AEWrapper',
    // 'http://opcfoundation.org/UA-Profile/Server/Methods',
    // 'http://opcfoundation.org/UA-Profile/Server/Auditing',
    // 'http://opcfoundation.org/UA-Profile/Server/NodeManagement',
    // 'http://opcfoundation.org/UA-Profile/Server/UserRoleBase',
    // 'http://opcfoundation.org/UA-Profile/Server/UserRoleManagement',
    // 'http://opcfoundation.org/UA-Profile/Server/StateMachine',
    // 'http://opcfoundation.org/UA-Profile/Server/ClientRedundancy',
    // 'http://opcfoundation.org/UA-Profile/Server/TransparentRedundancy',
    // 'http://opcfoundation.org/UA-Profile/Server/VisibleRedundancy',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalRawData',
    // 'http://opcfoundation.org/UA-Profile/Server/AggregateHistorical',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalDataAtTime',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalModifiedData',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalAnnotation',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalDataInsert',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalDataUpdate',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalDataReplace',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalDataDelete',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalStructuredData',
    // 'http://opcfoundation.org/UA-Profile/Server/BaseHistoricalEvent',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalEventUpdate',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalEventReplace',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalEventInsert',
    // 'http://opcfoundation.org/UA-Profile/Server/HistoricalEventDelete',
    // 'http://opcfoundation.org/UA-Profile/Server/AggregateSubscription',
    // 'http://opcfoundation.org/UA-Profile/Server/NanoEmbeddedDevice',
    // 'http://opcfoundation.org/UA-Profile/Server/NanoEmbeddedDevice2017',
    // 'http://opcfoundation.org/UA-Profile/Server/MicroEmbeddedDevice',
    // 'http://opcfoundation.org/UA-Profile/Server/MicroEmbeddedDevice2017',
    // 'http://opcfoundation.org/UA-Profile/Server/EmbeddedUA',
    // 'http://opcfoundation.org/UA-Profile/Server/EmbeddedUA2017',
    // 'http://opcfoundation.org/UA-Profile/Server/StandardUA',
    'http://opcfoundation.org/UA-Profile/Server/StandardUA2017',
    // 'http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary',
    // 'http://opcfoundation.org/UA-Profile/Transport/https-uabinary',
    // 'http://opcfoundation.org/UA-Profile/Transport/https-uasoapxml',
    // 'http://opcfoundation.org/UA-Profile/Transport/https-uajson',
    // 'http://opcfoundation.org/UA-Profile/Transport/wss-uasc-uabinary',
    // 'http://opcfoundation.org/UA-Profile/Transport/wss-uajson',
    // 'http://opcfoundation.org/UA-Profile/Security/UserAccessFull',
    // 'http://opcfoundation.org/UA-Profile/Security/UserAccessBase',
    // 'http://opcfoundation.org/UA-Profile/Security/TimeSync',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeAuditEvents',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeAlarmHandling',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeRandomNumbers',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeTimeouts',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeAdministrativeAccess',
    // 'http://opcfoundation.org/UA-Profile/Security/BestPracticeStrictMessage',
    // 'http://opcfoundation.org/UA-Profile/TransportSecurity/TLS-1-2',
    // 'http://opcfoundation.org/UA-Profile/TransportSecurity/TLS-1-2-PFS',
    'http://opcfoundation.org/UA/SecurityPolicy#None',
    // 'http://opcfoundation.org/UA/SecurityPolicy#Aes128_Sha256_RsaOaep',
    'http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256',
    // 'http://opcfoundation.org/UA/SecurityPolicy#Aes256_Sha256_RsaPss',
    'http://opcfoundation.org/UA-Profile/Security/UserToken/Anonymous',
    'http://opcfoundation.org/UA-Profile/Security/UserToken/Server/UserNamePassword',
    // 'http://opcfoundation.org/UA-Profile/Security/UserToken/Server/X509Certificate',
    // 'http://opcfoundation.org/UA-Profile/Security/UserToken/Server/IssuedToken',
    // 'http://opcfoundation.org/UA-Profile/Security/UserToken/Server/IssuedTokenWindows',
    // 'http://opcfoundation.org/UA-Profile/Security/UserToken/Server/JsonWebToken',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalDiscovery',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalDiscovery2017',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalDiscoveryAndCertificateManagement',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalDiscoveryAndCertificateManagement2017',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalServiceAuthorization',
    // 'http://opcfoundation.org/UA-Profile/Server/GlobalServiceKeyCredentials'
  ],
  softwareCertificates: [],
});

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