import { 
    coerceLocalizedText, 
    DataType,
    UAVariable,
    UAObject,
    AddressSpace,
    UAObjectType,
} from "node-opcua";

export const createMyMachine = (addressSpace: AddressSpace) => {
    // Add a machine manually:
    const machineryIdx = addressSpace?.getNamespaceIndex("http://opcfoundation.org/UA/Machinery/");
    const machinesFolder = addressSpace?.findNode(`ns=${machineryIdx};i=1001`) as UAObject;
    const namespace = addressSpace?.registerNamespace("http://mynewmachinenamespace/UA");
    const myMachine = namespace?.addObject({
        browseName: "MyMachine",
        organizedBy: machinesFolder,
    })
    const machineryIdentificationType = addressSpace?.findNode(`ns=${machineryIdx};i=1012`) as UAObjectType;
    const myMachineIdentification = machineryIdentificationType?.instantiate({
        browseName: "Identification",
        organizedBy: myMachine,
        optionals: ["Model"], // array of string 
    })
    const manufacturer = myMachineIdentification?.getChildByName("Manufacturer") as UAVariable;
    manufacturer?.setValueFromSource({
        dataType: DataType.LocalizedText,
        value: coerceLocalizedText("Manufacturer"),
    });
    const machineComponentsType = addressSpace?.findNode(`ns=${machineryIdx};i=1006`) as UAObjectType;
    const myMachineComponents = machineComponentsType?.instantiate({
        browseName: "Components",
        organizedBy: myMachine,
    })
    // instantiate components here -> organizedBy: myMachineComponents
}
