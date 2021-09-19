// Copyright 2021 (c) Andreas Heine

import { 
    MessageSecurityMode, 
    SecurityPolicy,
    ServerCapabilities,
    OperationLimits,
    OPCUAServerOptions,
    OPCUACertificateManager,
} from "node-opcua"

const port = Number(process.env.PORT) || 4840
const ip = process.env.IP || "0.0.0.0"

const PKIFolder = "pki"
const serverCertificate = "cert.pem"
const privateKey = "key.pem"
const userManager = {
    isValidUser: (userName: string, password: string) => {
        // for testing only!
        if (userName === "user" && password === "pw") {
            return true
        }
        return false
    }
}
const serverCertificateManager = new OPCUACertificateManager({
    automaticallyAcceptUnknownCertificate: true,
    name: "pki",
    rootFolder: PKIFolder
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
    allowAnonymous: true,
    userManager: userManager,
    serverCertificateManager: serverCertificateManager,
    certificateFile: serverCertificate,
    privateKeyFile: privateKey,
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