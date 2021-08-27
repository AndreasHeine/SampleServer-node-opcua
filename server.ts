// Copyright 2021 (c) Andreas Heine
//
// http://node-opcua.github.io/

import { 
    OPCUAServer, 
    MessageSecurityMode, 
    SecurityPolicy,
    ServerState,
    coerceLocalizedText, 
    ServerCapabilities,
    OperationLimits,
} from "node-opcua";

import { createMyMachine} from "./machines/mymachine/mymachine";
import { createShowCaseMachineTool} from "./machines/machinetool/showcasemachinetool";

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
        "nodesets/Opc.Ua.IA.NodeSet2.xml",
        "nodesets/Opc.Ua.MachineTool.NodeSet2.xml",

        // MachineTool Model
        "machines/machinetool/model/ShowCaseMachineTool.xml",
    ],
});

const create_addressSpace = async () => {
    const addressSpace = server.engine.addressSpace;
    if (addressSpace) {  
        await Promise.all([
            await createMyMachine(addressSpace),
            //await createCoatingLine(addressSpace),
            await createShowCaseMachineTool(addressSpace),
        ]);
    }
}

const startup = async () => {
    console.log(" starting server... ");
    await server.start();
    console.log(" server is ready on: ");
    server.endpoints.forEach(endpoint => console.log(" |--> ",endpoint.endpointDescriptions()[0].endpointUrl));
    console.log(" CTRL+C to stop ");  
    process.on("SIGINT", () => {
        if (server.engine.serverStatus.state === ServerState.Shutdown) {
            console.log(" Server shutdown already requested... shutdown will happen in ", server.engine.serverStatus.secondsTillShutdown, "second");
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
        await server.initialize();
        await create_addressSpace();
        await startup();
    } catch (error) {
        console.log(" error ", error);
        process.exit(-1);
    }
})();
