"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoatingLine = void 0;
const node_opcua_1 = require("node-opcua");
exports.createCoatingLine = (addressSpace) => {
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
};
