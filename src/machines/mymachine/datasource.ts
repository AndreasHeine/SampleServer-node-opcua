import { AddressSpace, DataType, DataValue, LocalizedText, NodeId, NodeIdType, StatusCodes, UAVariable, Variant } from "node-opcua";

function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

const Data = new Map<string, DataValue>()

export function initializeFakeDataSource(addressSpace: AddressSpace) {
    // Pressure
    Data.set("ns=41;i=1018", new DataValue({
        value: new Variant({
            value: 1013,
            dataType: DataType.Double
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set("ns=41;i=1020", new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 884, 0), {
                high: 2000,
                low: 500
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set("ns=41;i=1019", new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 887, 0), {
                namespaceUri: "http://www.opcfoundation.org/UA/units/un/cefact",
                unitId: -1,
                displayName: new LocalizedText({text: "mbar"}),
                description: new LocalizedText({text: "millibar"})
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))

    // Temperature
    Data.set("ns=41;i=1013", new DataValue({
        value: new Variant({
            value: 21,
            dataType: DataType.Double
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set("ns=41;i=1015", new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 884, 0), {
                high: 60,
                low: -20
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set("ns=41;i=1014", new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 887, 0), {
                namespaceUri: "http://www.opcfoundation.org/UA/units/un/cefact",
                unitId: -1,
                displayName: new LocalizedText({text: "°C"}),
                description: new LocalizedText({text: "degree Celsius"})
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))
}

async function getDataValue(nodeid: string): Promise<DataValue> {
    await delay(500) // fake api call
    return Data.get(nodeid) || new DataValue({
        value: new Variant({}),
        statusCode: StatusCodes.BadInternalError
    })
}

export const variableGetter = function(
    this: UAVariable, 
    callback: (err: Error | null, dataValue?: DataValue) => void): void {
        getDataValue(this.nodeId.toString())
        .then((value: DataValue) => {
            callback(null, value)
        })
        .catch((reason: any) => {
            callback(null, new DataValue({
                value: new Variant({
                    value: null,
                    dataType: this.dataTypeObj.displayName[0].text?.toString()
                }),
                statusCode: StatusCodes.BadInternalError,
            }))
        })
    }