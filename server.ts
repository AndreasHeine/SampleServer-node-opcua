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
        // deps
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
    ],
});

const create_addressSpace = () => {
    const addressSpace = server.engine.addressSpace;

    if (addressSpace) {    
        createCoatingLine(addressSpace);
        createMyMachine(addressSpace);
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
