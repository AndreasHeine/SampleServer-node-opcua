// Copyright 2021 (c) Suprateek Banerjee
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

import { DataType, UAVariable, AddressSpace } from "node-opcua";

export const createMotionDeviceSystemLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
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
  const mdsidx = addressSpace?.getNamespaceIndex(
    "http://vdma.org/OPCRoboticsTestServer/",
  );

  let generateNumber = function () {
    var value = 10 + 10 * Math.random();
    return value.toFixed(2);
  };

  const node1 = addressSpace?.findNode(`ns=${mdsidx};i=6020`) as UAVariable;
  const node2 = addressSpace?.findNode(`ns=${mdsidx};i=6024`) as UAVariable;
  const node3 = addressSpace?.findNode(`ns=${mdsidx};i=6031`) as UAVariable;
  const node4 = addressSpace?.findNode(`ns=${mdsidx};i=6027`) as UAVariable;
  const node5 = addressSpace?.findNode(`ns=${mdsidx};i=6033`) as UAVariable;
  const node6 = addressSpace?.findNode(`ns=${mdsidx};i=6054`) as UAVariable;
  const node7 = addressSpace?.findNode(`ns=${mdsidx};i=6022`) as UAVariable;
  // changes CurrentState each 1000 msec from Running to Stopped
  setInterval(() => {
    node1?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node2?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node3?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node4?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node5?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node6?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
    node7?.setValueFromSource({
      value: generateNumber(),
      dataType: DataType.Double,
    });
  }, 1000);
};
