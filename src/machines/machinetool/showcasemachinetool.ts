// SPDX-License-Identifier: Apache-2.0
//
// Copyright (c) 2021-2024 Andreas Heine
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
} from "node-opcua";

export const createShowCaseMachineToolLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
  const idx = addressSpace?.getNamespaceIndex(
    "http://umati.org/UA/ShowCaseMachineTool/",
  );
  const iaIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/IA/",
  );
  const mtoolIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/MachineTool/",
  );

  const activeProgramName = addressSpace?.findNode(
    `ns=${idx};i=6005`,
  ) as UAVariable;
  activeProgramName?.setValueFromSource({
    value: "Program_1",
    dataType: DataType.String,
  });

  const activeProgramNumberInList = addressSpace?.findNode(
    `ns=${idx};i=6006`,
  ) as UAVariable;
  activeProgramNumberInList?.setValueFromSource({
    value: 1,
    dataType: DataType.UInt16,
  });

  const productionActiveProgramStateCurrentState = addressSpace?.findNode(
    `ns=${idx};i=6007`,
  ) as UAVariable;
  productionActiveProgramStateCurrentState?.setValueFromSource({
    value: coerceLocalizedText("Running"),
    dataType: DataType.LocalizedText,
  });

  // changes CurrentState each 10000 msec from Running to Ended
  setInterval(() => {
    const state = addressSpace?.findNode(`ns=${idx};i=6007`) as UAVariable;
    const stateNumber = addressSpace?.findNode(
      `ns=${idx};i=6009`,
    ) as UAVariable;
    if (state?.readValue().value.value.text === "Running") {
      state?.setValueFromSource({
        value: coerceLocalizedText("Ended"),
        dataType: DataType.LocalizedText,
      });
      stateNumber.setValueFromSource({
        value: 2,
        dataType: DataType.UInt32,
      });
    } else {
      state?.setValueFromSource({
        value: coerceLocalizedText("Running"),
        dataType: DataType.LocalizedText,
      });
      stateNumber.setValueFromSource({
        value: 1,
        dataType: DataType.UInt32,
      });
    }
  }, 10000);

  // changes MachineryItemState.CurrentState each 10000 msec from Executing to NotExecuting
  setInterval(() => {
    const state = addressSpace?.findNode(`ns=${idx};i=6010`) as UAVariable;
    const stateNumber = addressSpace?.findNode(
      `ns=${idx};i=6014`,
    ) as UAVariable;
    if (state?.readValue().value.value.text === "Executing") {
      state?.setValueFromSource({
        value: coerceLocalizedText("NotExecuting"),
        dataType: DataType.LocalizedText,
      });
      stateNumber.setValueFromSource({
        value: 2,
        dataType: DataType.UInt32,
      });
    } else {
      state?.setValueFromSource({
        value: coerceLocalizedText("Executing"),
        dataType: DataType.LocalizedText,
      });
      stateNumber.setValueFromSource({
        value: 3,
        dataType: DataType.UInt32,
      });
    }
  }, 10000);

  // increments the value of FeedOverride by 5 each sec
  let override = 50;
  setInterval(() => {
    override += 5;
    if (override > 120) {
      override = 50;
    }
    const feedOverride = addressSpace?.findNode(
      `ns=${idx};i=6038`,
    ) as UAVariable;
    feedOverride.setValueFromSource({
      value: override,
      dataType: DataType.Double,
    });
  }, 1000);

  const spindleOverride = addressSpace?.findNode(
    `ns=${idx};i=6044`,
  ) as UAVariable;
  spindleOverride?.setValueFromSource({
    value: 100,
    dataType: DataType.Double,
  });

  // writing ExtensionObject (Range)
  const spindleEURange = addressSpace?.constructExtensionObject(
    new NodeId(NodeIdType.NUMERIC, 884, 0),
    {
      low: 60.0,
      high: 100.0,
    },
  );
  const spindleOverrideRange = addressSpace?.findNode(
    `ns=${idx};i=6046`,
  ) as UAVariable;
  spindleOverrideRange?.setValueFromSource({
    value: spindleEURange,
    dataType: DataType.ExtensionObject,
  });

  // writing a enum
  const channel1 = addressSpace?.findNode(`ns=${idx};i=6036`) as UAVariable;
  channel1.setValueFromSource({
    value: 0,
    dataType: DataType.Int32,
  });
};
