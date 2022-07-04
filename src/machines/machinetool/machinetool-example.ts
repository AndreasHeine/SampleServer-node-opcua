// Copyright 2021 (c) Andreas Heine
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
    coerceLocalizedText, 
    coerceNodeId,
    DataType,
    UAVariable,
    AddressSpace,
    NodeId,
    NodeIdType,
} from 'node-opcua'

export const createMachineToolExampleLogic = async (addressSpace: AddressSpace): Promise<void> => {

    /*
        machinelogic here:
        bind opc ua variables to a getter/setter functions or to an js variable
        -> https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.uavariable.html#bindvariable

        GETTER:
        const myVariableGetter = function(
        this: UAVariable, 
        callback: (err: Error | null, dataValue?: DataValue) => void): void {
            callback(null, new DataValue({
                value: new Variant({
                    value: null,
                    dataType: this.dataTypeObj.displayName[0].text?.toString()
                }),
                statusCode: StatusCodes.Good,
            }))
            return
        }

        SETTER:
        const myVariableSetter = function(this: UAVariable, dataValue: DataValue, callback: StatusCodeCallback): void {
            myVariable = dataValue.value.value
            callback(null, StatusCodes.Good);
            return
        };
        
        BINDING:
        node.setRolePermissions(ServerRolePermissionGroup.DEFAULT);
        node.bindVariable({
            timestamped_get: myVariableGetter,
            timestamped_set: myVariableSetter
        }, true);
    */

    const idx = addressSpace?.getNamespaceIndex('http://yourorganisation.org/MachineTool-Example/')
    const iaIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/IA/')
    const mtoolIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/MachineTool/')

    const activeProgramName = addressSpace?.findNode(`ns=${idx};i=55186`) as UAVariable
    activeProgramName?.setValueFromSource({
        value: 'Program_1',
        dataType: DataType.String,
    })

    const activeProgramNumberInList = addressSpace?.findNode(`ns=${idx};i=55185`) as UAVariable
    activeProgramNumberInList?.setValueFromSource({
        value: 1,
        dataType: DataType.UInt16,
    })

    const productionActiveProgramStateCurrentState = addressSpace?.findNode(`ns=${idx};i=55188`) as UAVariable
    productionActiveProgramStateCurrentState?.setValueFromSource({
        value: coerceLocalizedText('Running'),
        dataType: DataType.LocalizedText,
    })

    // changes CurrentState each 10000 msec from Running to Stopped
    setInterval(() => {
        const state = addressSpace?.findNode(`ns=${idx};i=55188`) as UAVariable
        const stateNumber = addressSpace?.findNode(`ns=${idx};i=55190`) as UAVariable
        if (state?.readValue().value.value.text === 'Running') {
            state?.setValueFromSource({
                value: coerceLocalizedText('Stopped'),
                dataType: DataType.LocalizedText,
            })
            stateNumber.setValueFromSource({
                value: coerceNodeId(2),
                dataType: DataType.NodeId,
            })
        } else {
            state?.setValueFromSource({
                value: coerceLocalizedText('Running'),
                dataType: DataType.LocalizedText,
            })
            stateNumber.setValueFromSource({
                value: coerceNodeId(1),
                dataType: DataType.NodeId,
            })
        }
    }, 10000)

    // increments the value of freeoverride by 5 each sec
    let override = 50
    setInterval(() => {
        override += 5
        if (override > 120) {
            override = 50
        }
        const feedOverride = addressSpace?.findNode(`ns=${idx};i=55229`) as UAVariable
        feedOverride.setValueFromSource({
            value: override,
            dataType: DataType.Double,
        })
    }, 1000)

    const spindleOverride = addressSpace?.findNode(`ns=${idx};i=55238`) as UAVariable
    spindleOverride?.setValueFromSource({
        value: 100,
        dataType: DataType.Double,
    })

    // writing ExtensionObject (Range)
    const spindleEURange = addressSpace?.constructExtensionObject(
        new NodeId(NodeIdType.NUMERIC, 884, 0),
        {
            low: 60.0,
            high: 100.0,
        }
    )
    const spindleOverrideRange = addressSpace?.findNode(`ns=${idx};i=55240`) as UAVariable
    spindleOverrideRange?.setValueFromSource({
        value: spindleEURange,
        dataType: DataType.ExtensionObject,
    })

    // writing a enum
    const channel1 = addressSpace?.findNode(`ns=${idx};i=55233`) as UAVariable
    channel1.setValueFromSource({
        value: 1,
        dataType: DataType.Int32
    })
}
