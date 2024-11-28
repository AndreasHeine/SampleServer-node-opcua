// Copyright 2024 (c) Andreas Heine
//
//   Licensed under the Apache License, Version 2.0 (the 'License');
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an 'AS IS' BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import { 
    AddressSpace,
    DataType, 
    DataValue,
    EUInformation,
    LocalizedText, 
    makeEUInformation, 
    NodeId, 
    NodeIdType, 
    standardUnits, 
    StatusCodes, 
    UAVariable, 
    Variant 
} from "node-opcua";

const engineeringUnitMap = new Map<string, EUInformation>()
Object.entries(standardUnits).forEach((value: [string, EUInformation], index: number, array: [string, EUInformation][]) => {
    const k = value[0]
    const v = value[1]
    engineeringUnitMap.set(k, v) // "percent", EUInformation
    engineeringUnitMap.set(`${v.displayName.text}`, v) // "%", EUInformation
})

const degC = engineeringUnitMap.get("°C")!
const pressure = engineeringUnitMap.get("mbar")!

function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

const Data = new Map<string, DataValue>()

export function initializeFakeDataSource(addressSpace: AddressSpace) {
    const idx = addressSpace.getNamespaceIndex("http://mynewmachinenamespace/UA")
    // Pressure
    Data.set(`ns=${idx};i=1018`, new DataValue({
        value: new Variant({
            value: 1013,
            dataType: DataType.Double
        }),
        statusCode: StatusCodes.Good
    }))
    setInterval(() => {
        Data.set(`ns=${idx};i=1018`, new DataValue({
            value: new Variant({
                value: (Math.random() * 1000),
                dataType: DataType.Double
            }),
            statusCode: StatusCodes.Good
        })) 
    }, 2000)
    Data.set(`ns=${idx};i=1020`, new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 884, 0), {
                high: 2000,
                low: 500
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set(`ns=${idx};i=1019`, new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 887, 0),                 {
                namespaceUri: pressure.namespaceUri,
                unitId: pressure.unitId,
                displayName: pressure.displayName,
                description: pressure.description
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))

    // Temperature
    Data.set(`ns=${idx};i=1013`, new DataValue({
        value: new Variant({
            value: 21,
            dataType: DataType.Double
        }),
        statusCode: StatusCodes.Good
    }))
    setInterval(() => {
        Data.set(`ns=${idx};i=1013`, new DataValue({
            value: new Variant({
                value: (Math.random() * 100) + 50,
                dataType: DataType.Double
            }),
            statusCode: StatusCodes.Good
        })) 
    }, 5000)
    Data.set(`ns=${idx};i=1015`, new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(new NodeId(NodeIdType.NUMERIC, 884, 0), {
                high: 60,
                low: -20
            }),
            dataType: DataType.ExtensionObject
        }),
        statusCode: StatusCodes.Good
    }))
    Data.set(`ns=${idx};i=1014`, new DataValue({
        value: new Variant({
            value: addressSpace.constructExtensionObject(
                new NodeId(NodeIdType.NUMERIC, 887, 0), 
                {
                    namespaceUri: degC.namespaceUri,
                    unitId: degC.unitId,
                    displayName: degC.displayName,
                    description: degC.description
                }
            ),
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