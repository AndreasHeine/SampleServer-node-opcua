// Copyright 2023 (c) Andreas Kraemer, basyskom GmbH - Germany
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

export const createWoodWorkingBasicLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
  const nsIdx = addressSpace?.getNamespaceIndex(
    "http://basyskom.com/woodworking_demo/",
  );

  // Define basic "bs..." woodworking IDENTIFICATION nodes
  const bsDeviceClassNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6001`,
  ) as UAVariable;
  const bsManufacturerNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6002`,
  ) as UAVariable;
  const bsModelNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6003`,
  ) as UAVariable;
  const bsProductInstanceUriNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6004`,
  ) as UAVariable;
  const bsSerialNumberNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6005`,
  ) as UAVariable;
  const bsYearOfConstructionNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6006`,
  ) as UAVariable;

  // Define basic "bs..." woodworking STATE - MACHINE -FLAGS nodes
  const bsAlarmNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6009`,
  ) as UAVariable;
  const bsCalibratedNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6010`,
  ) as UAVariable;
  const bsEmergencyNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6011`,
  ) as UAVariable;
  const bsErrorNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6012`,
  ) as UAVariable;
  const bsMachineInitNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6013`,
  ) as UAVariable;
  const bsMachineOnNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6014`,
  ) as UAVariable;
  const bsPowerPresentNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6015`,
  ) as UAVariable;
  const bsRecipeInRunNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6016`,
  ) as UAVariable;
  const bsWarningNode = addressSpace?.findNode(
    `ns=${nsIdx};i=6017`,
  ) as UAVariable;

  // Define basic "bs..." woodworking STATE - MACHINE - OVERVIEW nodes
  const bsCurrentModeNode = addressSpace.findNode(
    `ns=${nsIdx};i=6007`,
  ) as UAVariable;
  const bsCurrentStateNode = addressSpace.findNode(
    `ns=${nsIdx};i=6008`,
  ) as UAVariable;

  // Set basic woodworking IDENTIFICATION nodes
  bsDeviceClassNode?.setValueFromSource({
    dataType: DataType.String,
    value: "Class A12",
  });
  bsProductInstanceUriNode?.setValueFromSource({
    dataType: DataType.String,
    value: "https://www.example.com",
  });
  bsSerialNumberNode?.setValueFromSource({
    dataType: DataType.String,
    value: "378485745354392",
  });
  bsYearOfConstructionNode?.setValueFromSource({
    dataType: DataType.UInt16,
    value: 2023,
  });

  // Set basic woodworking STATE - MACHINE - FLAGS nodes
  bsAlarmNode?.setValueFromSource({ dataType: DataType.Boolean, value: false });
  bsCalibratedNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: true,
  });
  bsEmergencyNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: false,
  });
  bsMachineInitNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: false,
  });
  bsMachineOnNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: true,
  });
  bsPowerPresentNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: true,
  });
  bsRecipeInRunNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: true,
  });
  bsWarningNode?.setValueFromSource({
    dataType: DataType.Boolean,
    value: false,
  });

  // Intervall to change opc ua node-values
  var intervallID = setInterval(function () {
    setBasicWwValues();
  }, 2500);

  // Set the identification values for basic woodworking companion specification
  function setBasicWwValues() {
    let rndmMin = 10;
    let rndmMax = 500;
    let rndm = getRandomArbitrary(rndmMin, rndmMax);

    // Set basic woodworking STATE - MACHINE - FLAGS nodes
    bsAlarmNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm < 450 ? false : true,
    });
    bsCalibratedNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 170 ? false : true,
    });
    bsEmergencyNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm < 350 ? false : true,
    });
    bsMachineInitNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 150 ? false : true,
    });
    bsMachineOnNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 40 ? false : true,
    });
    bsPowerPresentNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 130 ? false : true,
    });
    bsRecipeInRunNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm > 200 ? false : true,
    });
    bsWarningNode?.setValueFromSource({
      dataType: DataType.Boolean,
      value: rndm < 350 ? false : true,
    });

    // Set current mode STATE - MACHINE - OVERWIEW
    switch (true) {
      case rndm > 0 && rndm < 100:
        bsCurrentModeNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 1,
        });
        bsCurrentStateNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 4,
        });
        break;
      case rndm > 100 && rndm < 200:
        bsCurrentModeNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 2,
        });
        bsCurrentStateNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 3,
        });
        break;
      case rndm > 200 && rndm < 300:
        bsCurrentModeNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 3,
        });
        bsCurrentStateNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 2,
        });
        break;
      case rndm > 300 && rndm < 400:
        bsCurrentModeNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 4,
        });
        bsCurrentStateNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 1,
        });
        break;
      case rndm > 400 && rndm < 500:
        bsCurrentModeNode?.setValueFromSource({
          dataType: DataType.Int32,
          value: 5,
        });
        break;
      default:
        break;
    }
  }

  //Returns an randomized value between given range
  function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
};
