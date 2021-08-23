import { 
    OPCUAServer, 
    MessageSecurityMode, 
    SecurityPolicy,
    ServerState,
    coerceLocalizedText, 
    ServerCapabilities,
    OperationLimits,
} from "node-opcua" ;

const port = Number(process.env.ua_port) || 4840;
const ip = process.env.ua_ip || "127.0.0.1";

const server = new OPCUAServer({
    port: port,
    hostname: ip,
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
        "nodesets/Opc.Ua.NodeSet2.xml", 
        "nodesets/Opc.Ua.Di.NodeSet2.xml", 
        "nodesets/Opc.Ua.Machinery.NodeSet2.xml",
        "nodesets/Opc.Ua.SurfaceTechnology.NodeSet2.xml",
        "nodesets/CoatingLine-example.xml",
        "nodesets/Pretreatment.xml",
        "nodesets/Materialsupplyroom.xml",
        "nodesets/dosingsystem.xml",
        "nodesets/ovenbooth.xml",
        "nodesets/ConveyorGunsAxes.xml"
    ],
});

const create_addressSpace = () => {

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