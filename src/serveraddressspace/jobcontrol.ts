// Copyright 2022 (c) Andreas Heine
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
    coerceQualifiedName,
    InstantiateObjectOptions,
    setNamespaceMetaData,
    UAObject,
    UAObjectType,
} from 'node-opcua'
import { ServerRolePermissionGroup } from '../permissiongroups'

export const createJobContolLogic = async (addressSpace: AddressSpace): Promise<void> => {
    const machineryIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/Machinery/')
    const machinesFolder = addressSpace?.findNode(`ns=${machineryIdx};i=1001`) as UAObject

    const namespace = addressSpace?.registerNamespace('http://MyControledMachine-Namespace/UA')
    namespace.setDefaultRolePermissions(ServerRolePermissionGroup.DEFAULT)
    setNamespaceMetaData(namespace)

    const controledMachine = namespace?.addObject({
        browseName: 'MyControledMachine',
        nodeId: `ns=${namespace.index};s=MyControledMachine`,
        organizedBy: machinesFolder,
    })

    const jobIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/Machinery/Jobs/')
    const jobManagementType = addressSpace?.findNode(`ns=${jobIdx};i=1003`) as UAObjectType

    jobManagementType.instantiate({
        componentOf: controledMachine,
        browseName: `JobManager`,
        namespace: namespace,
        optionals: []
    } as InstantiateObjectOptions)
}