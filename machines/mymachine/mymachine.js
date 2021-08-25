"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMyMachine = void 0;
const node_opcua_1 = require("node-opcua");
exports.createMyMachine = (addressSpace) => {
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
    // instantiate components here -> organizedBy: myMachineComponents
};
