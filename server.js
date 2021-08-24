"use strict";
// Copyright 2021 (c) Andreas Heine
//
// http://node-opcua.github.io/
// https://node-opcua.github.io/api_doc/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
const port = Number(process.env.ua_port) || 4840;
const ip = process.env.ua_ip || "127.0.0.1";
const server = new node_opcua_1.OPCUAServer({
    port: port,
    hostname: ip,
    resourcePath: "/UA",
    buildInfo: {
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
    serverCapabilities: new node_opcua_1.ServerCapabilities({
        maxBrowseContinuationPoints: 10,
        maxArrayLength: 1000,
        operationLimits: new node_opcua_1.OperationLimits({
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
        node_opcua_1.MessageSecurityMode.None,
    ],
    securityPolicies: [
        node_opcua_1.SecurityPolicy.None,
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
    const addressSpace = server.engine.addressSpace;
    // CoatinglineIdentification:
    const coatingLineIdentification = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.findNode("ns=5;i=5003");
    coatingLineIdentification.location.setValueFromSource({
        dataType: node_opcua_1.DataType.String,
        value: "Location",
    });
    coatingLineIdentification.manufacturer.setValueFromSource({
        dataType: node_opcua_1.DataType.LocalizedText,
        value: node_opcua_1.coerceLocalizedText("Manufacturer"),
    });
    coatingLineIdentification.model.setValueFromSource({
        dataType: node_opcua_1.DataType.LocalizedText,
        value: node_opcua_1.coerceLocalizedText("Model"),
    });
    coatingLineIdentification.productInstanceUri.setValueFromSource({
        dataType: node_opcua_1.DataType.String,
        value: "ProductInstanceUri",
    });
    coatingLineIdentification.serialNumber.setValueFromSource({
        dataType: node_opcua_1.DataType.String,
        value: "SerialNumber",
    });
    coatingLineIdentification.softwareRevision.setValueFromSource({
        dataType: node_opcua_1.DataType.String,
        value: "SoftwareRevision",
    });
    coatingLineIdentification.yearOfConstruction.setValueFromSource({
        dataType: node_opcua_1.DataType.UInt16,
        value: new Date().getFullYear(),
    });
    // Add a machine manually:
    const machineryIdx = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.getNamespaceIndex("http://opcfoundation.org/UA/Machinery/");
    const machinesFolder = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.findNode(`ns=${machineryIdx};i=1001`);
    const namespace = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.registerNamespace("http://mynewmachinenamespace/UA");
    const myMachine = namespace === null || namespace === void 0 ? void 0 : namespace.addObject({
        browseName: "MyMachine",
        organizedBy: machinesFolder,
    });
    const machineryIdentificationType = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.findNode(`ns=${machineryIdx};i=1012`);
    const myMachineIdentification = machineryIdentificationType === null || machineryIdentificationType === void 0 ? void 0 : machineryIdentificationType.instantiate({
        browseName: "Identification",
        organizedBy: myMachine,
        optionals: ["Model"],
    });
    const manufacturer = myMachineIdentification === null || myMachineIdentification === void 0 ? void 0 : myMachineIdentification.getChildByName("Manufacturer");
    manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.setValueFromSource({
        dataType: node_opcua_1.DataType.LocalizedText,
        value: node_opcua_1.coerceLocalizedText("Manufacturer"),
    });
    const machineComponentsType = addressSpace === null || addressSpace === void 0 ? void 0 : addressSpace.findNode(`ns=${machineryIdx};i=1006`);
    const myMachineComponents = machineComponentsType === null || machineComponentsType === void 0 ? void 0 : machineComponentsType.instantiate({
        browseName: "Components",
        organizedBy: myMachine,
    });
};
const init = () => {
    create_addressSpace();
    console.log(" starting... ");
    server.start();
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" server is ready on ", endpointUrl);
    console.log(" CTRL+C to stop ");
    process.on("SIGINT", () => {
        if (server.engine.serverStatus.state === node_opcua_1.ServerState.Shutdown) {
            console.log("Server shutdown already requested... shutdown will happen in ", server.engine.serverStatus.secondsTillShutdown, "second");
            return;
        }
        console.log(" Received server interruption from user ");
        console.log(" shutting down ...");
        const reason = node_opcua_1.coerceLocalizedText("Shutdown by administrator");
        if (reason != null) {
            server.engine.serverStatus.shutdownReason = reason;
        }
        server.shutdown(10000, () => {
            console.log(" shutting down completed ");
            console.log(" done ");
            process.exit(0);
        });
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        server.initialize(init);
    }
    catch (error) {
        console.log("error", error);
        process.exit(-1);
    }
}))();
