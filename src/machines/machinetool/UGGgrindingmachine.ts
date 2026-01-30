// SPDX-License-Identifier: Apache-2.0
//
// Copyright (c) 2024 Goetz Goerisch
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
  LocalizedText,
} from "node-opcua";

export const createUGGgrindingMachineLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
  const idx = addressSpace?.getNamespaceIndex(
    "https://www.grinding.ch/UA/instances/umati/",
  );
  const iaIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/IA/",
  );
  const mtoolIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/MachineTool/",
  );

  // Set initial state of MachineryOperationMode
  const monitoringMachineToolMachineryOperationModeCurrentState =
    addressSpace?.findNode(
      `ns=${idx};s=MyMachine.Monitoring.MachineTool.MachineryOperationMode.CurrentState`,
    ) as UAVariable;
  monitoringMachineToolMachineryOperationModeCurrentState?.setValueFromSource({
    //value: coerceLocalizedText('Processing'),
    value: new LocalizedText({ text: "Processing", locale: "en-en" }),
    dataType: DataType.LocalizedText,
  });

  // changes CurrentState each 10000 msec from Processing to Setup
  setInterval(() => {
    const state = addressSpace?.findNode(
      `ns=${idx};s=MyMachine.Monitoring.MachineTool.MachineryOperationMode.CurrentState`,
    ) as UAVariable;
    if (state?.readValue().value.value.text === "Processing") {
      state?.setValueFromSource({
        value: new LocalizedText({ text: "Setup", locale: "en-en" }),
        dataType: DataType.LocalizedText,
      });
    } else {
      state?.setValueFromSource({
        value: new LocalizedText({ text: "Processing", locale: "en-en" }),
        dataType: DataType.LocalizedText,
      });
    }
  }, 10000);

  // find Stacklight SignalOn
  const monitoringStacklightLamp1SignalOn = addressSpace?.findNode(
    `ns=${idx};s=MyMachine.Monitoring.Stacklight.Lamp1.SignalOn`,
  ) as UAVariable;
  const monitoringStacklightLamp2SignalOn = addressSpace?.findNode(
    `ns=${idx};s=MyMachine.Monitoring.Stacklight.Lamp2.SignalOn`,
  ) as UAVariable;
  const monitoringStacklightLamp3SignalOn = addressSpace?.findNode(
    `ns=${idx};s=MyMachine.Monitoring.Stacklight.Lamp3.SignalOn`,
  ) as UAVariable;

  // Set Stacklight Initial values
  monitoringStacklightLamp1SignalOn?.setValueFromSource({
    dataType: DataType.Boolean,
    value: false,
  });
  monitoringStacklightLamp2SignalOn?.setValueFromSource({
    dataType: DataType.Boolean,
    value: false,
  });
  monitoringStacklightLamp3SignalOn?.setValueFromSource({
    dataType: DataType.Boolean,
    value: true,
  });

  // Interval to change opc ua node-values
  const intervallID = setInterval(function () {
    setUGGgrindingmachineValues();
  }, 2500);

  // Set the Grinding Machine values
  function setUGGgrindingmachineValues() {
    const rndmMin = 10;
    const rndmMax = 500;
    const rndm = getRandomArbitrary(rndmMin, rndmMax);

    // Set Stacklights on and off
    monitoringStacklightLamp1SignalOn?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm < 50 ? false : true,
    });
    monitoringStacklightLamp2SignalOn?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 170 ? false : true,
    });
    monitoringStacklightLamp3SignalOn?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 350 ? false : true,
    });

    //Returns an randomized value between given range
    function getRandomArbitrary(min: number, max: number): number {
      return Math.random() * (max - min) + min;
    }

    // Set initial state of ActiveProgramState
    const productionActiveProgramStateCurrentState = addressSpace?.findNode(
      `ns=${idx};s=MyMachine.Production.ActiveProgram.State.CurrentState`,
    ) as UAVariable;
    productionActiveProgramStateCurrentState?.setValueFromSource({
      value: new LocalizedText({ text: "Running", locale: "en-en" }),
      dataType: DataType.LocalizedText,
    });

    // changes CurrentState each 10000 msec from Running to Ended
    setInterval(() => {
      const state = addressSpace?.findNode(
        `ns=${idx};s=MyMachine.Production.ActiveProgram.State.CurrentState`,
      ) as UAVariable;
      if (state?.readValue().value.value.text === "Running") {
        state?.setValueFromSource({
          value: new LocalizedText({ text: "Ended", locale: "en-en" }),
          dataType: DataType.LocalizedText,
        });
      } else {
        state?.setValueFromSource({
          value: new LocalizedText({ text: "Setup", locale: "en-en" }),
          dataType: DataType.LocalizedText,
        });
      }
    }, 10000);
  }
};
