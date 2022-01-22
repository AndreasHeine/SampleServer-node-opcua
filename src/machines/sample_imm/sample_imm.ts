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
    AddressSpace,
} from 'node-opcua'

export const createSampleImmLogic = async (addressSpace: AddressSpace): Promise<void> => {

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

}