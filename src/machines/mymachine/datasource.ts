import { DataType, DataTypeIds, DataValue, StatusCodes, UAVariable, Variant } from "node-opcua";

function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

const Data = new Map<string, DataValue>()

Data.set("ns=41;i=1018", new DataValue({
    value: new Variant({
        value: 0,
        dataType: DataType.Double
    }),
    statusCode: StatusCodes.Good
}))
Data.set("ns=41;i=1013", new DataValue({
    value: new Variant({
        value: 0,
        dataType: DataType.Double
    }),
    statusCode: StatusCodes.Good
}))
// ...

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