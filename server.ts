// Copyright 2021 (c) Andreas Heine
//
// http://node-opcua.github.io/
// https://node-opcua.github.io/api_doc/

import { 
    OPCUAServer, 
    MessageSecurityMode, 
    SecurityPolicy,
    ServerState,
    coerceLocalizedText, 
    ServerCapabilities,
    OperationLimits,
} from "node-opcua";

import { createCoatingLine } from "./machines/coatingline/coatingline";
import { createMyMachine} from "./machines/mymachine/mymachine";
import { createMachineTool} from "./machines/machinetool/machinetool";

const port = Number(process.env.ua_port) || 4840;
const ip = process.env.ua_ip || "0.0.0.0";

const server = new OPCUAServer({
    port: port,
    hostname: ip,
    maxAllowedSessionNumber: 100,
    maxConnectionsPerEndpoint: 100,
    timeout: 10000,
    resourcePath: "/UA",
    buildInfo : {
        productUri: "SampleServer-productUri",
        productName: "SampleServer-productName",
        manufacturerName: "SampleServer-manufacturerName",
        buildNumber: "v1.0.0",
        buildDate: new Date()
    },
    serverInfo: {
        applicationName: { 
            text: "SampleServer-applicationName", 
            locale: "en" 
        },
        applicationUri: "urn:SampleServer",
        productUri: "SampleServer-productUri"
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
    securityModes: [
        MessageSecurityMode.None, 
    ],
    securityPolicies: [
        SecurityPolicy.None, 
    ],
    disableDiscovery: false,
    nodeset_filename: [
        // nodesets
        "nodesets/Opc.Ua.NodeSet2.xml", 
        "nodesets/Opc.Ua.Di.NodeSet2.xml", 
        "nodesets/Opc.Ua.Machinery.NodeSet2.xml",
        "nodesets/Opc.Ua.SurfaceTechnology.NodeSet2.xml",
        // ia spec. xml http://opcfoundation.org/UA/IA/
        // machinetool spec. xml http://opcfoundation.org/UA/MachineTool/

        // CoatingLine Model
        "machines/coatingline/model/CoatingLine-example.xml",
        "machines/coatingline/model/Pretreatment.xml",
        "machines/coatingline/model/Materialsupplyroom.xml",
        "machines/coatingline/model/dosingsystem.xml",
        "machines/coatingline/model/ovenbooth.xml",
        "machines/coatingline/model/ConveyorGunsAxes.xml",

        // MachineTool Model
        // "machines/mymachinetool/model/mymachinetool.xml",
    ],
});

const create_addressSpace = () => {
    const addressSpace = server.engine.addressSpace;
    const nameSpaceArray = addressSpace?.getNamespaceArray();
    const namespaceUris = nameSpaceArray?.map(namespace => namespace.namespaceUri);

    if (addressSpace) {  
        createMyMachine(addressSpace);
        // check if namespaceUri exist
        if (
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example') &&
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example/ConveyorGunsAxes/') &&
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example/DosingSystem/') &&
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example/MaterialSupplyRoom/') &&
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example/OvenBooth/') &&
            namespaceUris?.find(uri => 'http://opcfoundation.org/UA/SurfaceTechnology/Example/Pretreatment')
            ) {
            createCoatingLine(addressSpace);
        } else {
            console.log("CoatingLine-Model not found...")
        }
        createMachineTool(addressSpace);
    }
}

const init = () => {
    create_addressSpace();

    console.log(" starting... ");
    server.start();
    
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" server is ready on ", endpointUrl);
    console.log(" CTRL+C to stop ");

    process.on("SIGINT", () => {
        if (server.engine.serverStatus.state === ServerState.Shutdown) {
            console.log("Server shutdown already requested... shutdown will happen in ", server.engine.serverStatus.secondsTillShutdown, "second");
            return;
        }
        console.log(" Received server interruption from user ");
        console.log(" shutting down ...");
        const reason = coerceLocalizedText("Shutdown by administrator");
        if (reason != null) {
            server.engine.serverStatus.shutdownReason = reason;
        }
        server.shutdown(10000, () => {
        console.log(" shutting down completed ");
        console.log(" done ");
        process.exit(0);
        });
    });
}

(async () => {

    try {
        server.initialize(init);
    } catch (error) {
        console.log("error", error);
        process.exit(-1);
    }

})();
