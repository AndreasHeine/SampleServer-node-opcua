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
    DataType,
    UAVariable,
    UAObject,
    AddressSpace,
    UAObjectType,
    setNamespaceMetaData,
} from 'node-opcua'
import { ServerRolePermissionGroup } from '../../permissiongroups'
import { variableGetter } from './datasource'

export const createMyMachineLogic = async (addressSpace: AddressSpace): Promise<void> => {
    // Add a machine manually:
    const machineryIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/Machinery/')
    const machinesFolder = addressSpace?.findNode(`ns=${machineryIdx};i=1001`) as UAObject
    const namespace = addressSpace?.registerNamespace('http://mynewmachinenamespace/UA')
    namespace.setDefaultRolePermissions(ServerRolePermissionGroup.DEFAULT)
    setNamespaceMetaData(namespace)
    const myMachine = namespace?.addObject({
        browseName: 'MyMachine',
        nodeId: `ns=${namespace.index};s=MyMachine`,
        organizedBy: machinesFolder,
    })
    const machineryIdentificationType = addressSpace?.findNode(`ns=${machineryIdx};i=1012`) as UAObjectType
    const myMachineIdentification = machineryIdentificationType?.instantiate({
        browseName: {
            name: 'Identification',
            namespaceIndex: machineryIdx
        },
        namespace: namespace,
        optionals: ['Model'], // array of string 
    })
    myMachineIdentification.addReference({
            referenceType: 'HasAddIn',
            nodeId: myMachine,
            isForward: false,
    })
    const manufacturer = myMachineIdentification?.getChildByName('Manufacturer') as UAVariable
    manufacturer?.setValueFromSource({
        dataType: DataType.LocalizedText,
        value: coerceLocalizedText('Andreas Heine'),
    })
    const machineComponentsType = addressSpace?.findNode(`ns=${machineryIdx};i=1006`) as UAObjectType
    const myMachineComponents = machineComponentsType?.instantiate({
        browseName: {
            name: 'Components',
            namespaceIndex: machineryIdx
        },
        namespace: namespace,
    })
    myMachineComponents.addReference({
        referenceType: 'HasAddIn',
        nodeId: myMachine,
        isForward: false,
    })

    // ItemState + OperationMode

    const machineryBuildingBlocks = namespace.addObject({
        browseName: {name : "MachineryBuildingBlocks", namespaceIndex: machineryIdx},
        typeDefinition: "FolderType",
        componentOf: myMachine
    });

    const myItemState = (addressSpace!.findNode(`ns=${machineryIdx};i=1002`) as UAObjectType).instantiate({
        browseName: {
            name: 'MachineryItemState',
            namespaceIndex: machineryIdx
        },
        namespace: namespace,
    })
    myItemState.addReference({
        referenceType: 'HasAddIn',
        nodeId: machineryBuildingBlocks,
        isForward: false,
    })

    const myOperationMode = (addressSpace!.findNode(`ns=${machineryIdx};i=1008`) as UAObjectType).instantiate({
        browseName: {
            name: 'MachineryOperationMode',
            namespaceIndex: machineryIdx
        },
        namespace: namespace,
    })
    myOperationMode.addReference({
        referenceType: 'HasAddIn',
        nodeId: machineryBuildingBlocks,
        isForward: false,
    })



    // ProcessValues

    const processValuesIdx = addressSpace!.getNamespaceIndex("http://opcfoundation.org/UA/Machinery/ProcessValues/")
    const processValuesType = addressSpace!.findNode(`ns=${processValuesIdx};i=1003`) as UAObjectType
    const monitoringObject = namespace!.addObject({
        browseName: 'Monitoring',
        nodeId: `ns=${namespace.index};s=Monitoring`,
        componentOf: myMachine,
    })
    
    const temperature = processValuesType.instantiate({
        browseName: {
            name: 'Temperature',
            namespaceIndex: processValuesIdx
        },
        namespace: namespace,
    })
    temperature.addReference({
        referenceType: 'Organizes',
        nodeId: monitoringObject,
        isForward: false,
    })
    const temperatureAnalogSignal = temperature.getChildByName("AnalogSignal") as UAVariable
    temperatureAnalogSignal.bindVariable({
        timestamped_get: variableGetter,
        // timestamped_set: variableSetter
    }, true)

    const pressure = processValuesType.instantiate({
        browseName: {
            name: 'Pressure',
            namespaceIndex: processValuesIdx
        },
        namespace: namespace,
    })
    pressure.addReference({
        referenceType: "Organizes",
        nodeId: monitoringObject,
        isForward: false,
    })
    const pressureAnalogSignal = pressure.getChildByName("AnalogSignal") as UAVariable
    pressureAnalogSignal.bindVariable({
        timestamped_get: variableGetter,
        // timestamped_set: variableSetter
    }, true)


    // instantiate components here -> organizedBy: myMachineComponents
}
