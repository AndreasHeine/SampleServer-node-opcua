import { 
    coerceLocalizedText, 
    DataType,
    UAVariable,
    UAObject,
    AddressSpace,
} from "node-opcua";

interface MachineIdentificationType extends UAObject {
    location: UAVariable;
    manufacturer: UAVariable;
    model: UAVariable;
    productInstanceUri: UAVariable;
    serialNumber: UAVariable;
    softwareRevision: UAVariable;
    yearOfConstruction: UAVariable;
}

export const createCoatingLine = async (addressSpace: AddressSpace) => {
        // CoatinglineIdentification:
        const coatingLineIdentification = addressSpace?.findNode("ns=5;i=5003") as MachineIdentificationType;

        coatingLineIdentification.location.setValueFromSource({
            dataType: DataType.String,
            value: "Location",
        });
        coatingLineIdentification.manufacturer.setValueFromSource({
            dataType: DataType.LocalizedText,
            value: coerceLocalizedText("Manufacturer"),
        });
        coatingLineIdentification.model.setValueFromSource({
            dataType: DataType.LocalizedText,
            value: coerceLocalizedText("Model"),
        });
        coatingLineIdentification.productInstanceUri.setValueFromSource({
            dataType: DataType.String,
            value: "ProductInstanceUri",
        });
        coatingLineIdentification.serialNumber.setValueFromSource({
            dataType: DataType.String,
            value: "SerialNumber",
        });
        coatingLineIdentification.softwareRevision.setValueFromSource({
            dataType: DataType.String,
            value: "SoftwareRevision",
        });
        coatingLineIdentification.yearOfConstruction.setValueFromSource({
            dataType: DataType.UInt16,
            value: new Date().getFullYear(),
        });
    
}