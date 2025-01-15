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
} from "node-opcua";
import { ServerRolePermissionGroup } from "../../permissiongroups";
import { initializeFakeDataSource, variableGetter } from "./datasource";

export const createMyMachineLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
  // Add a machine manually:
  const machineryIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/Machinery/",
  );
  const machinesFolder = addressSpace?.findNode(
    `ns=${machineryIdx};i=1001`,
  ) as UAObject;
  const namespace = addressSpace?.registerNamespace(
    "http://mynewmachinenamespace/UA",
  );
  namespace.setDefaultRolePermissions(ServerRolePermissionGroup.DEFAULT);
  setNamespaceMetaData(namespace);
  const myMachine = namespace?.addObject({
    browseName: "MyMachine",
    nodeId: `ns=${namespace.index};s=MyMachine`,
    organizedBy: machinesFolder,
  });
  const machineryIdentificationType = addressSpace?.findNode(
    `ns=${machineryIdx};i=1012`,
  ) as UAObjectType;
  const myMachineIdentification = machineryIdentificationType?.instantiate({
    browseName: {
      name: "Identification",
      namespaceIndex: machineryIdx,
    },
    namespace: namespace,
    optionals: ["Model"], // array of string
  });
  myMachineIdentification.addReference({
    referenceType: "HasAddIn",
    nodeId: myMachine,
    isForward: false,
  });
  const manufacturer = myMachineIdentification?.getChildByName(
    "Manufacturer",
  ) as UAVariable;
  manufacturer?.setValueFromSource({
    dataType: DataType.LocalizedText,
    value: coerceLocalizedText("Andreas Heine"),
  });
  const model = myMachineIdentification?.getChildByName("Model") as UAVariable;
  model?.setValueFromSource({
    dataType: DataType.LocalizedText,
    value: coerceLocalizedText("Model-123"),
  });
  const uri = myMachineIdentification?.getChildByName(
    "ProductInstanceUri",
  ) as UAVariable;
  uri?.setValueFromSource({
    dataType: DataType.String,
    value: "ProductInstanceUri-123",
  });
  const serial = myMachineIdentification?.getChildByName(
    "SerialNumber",
  ) as UAVariable;
  serial?.setValueFromSource({
    dataType: DataType.String,
    value: "SerialNumber-123",
  });
  const machineComponentsType = addressSpace?.findNode(
    `ns=${machineryIdx};i=1006`,
  ) as UAObjectType;
  const myMachineComponents = machineComponentsType?.instantiate({
    browseName: {
      name: "Components",
      namespaceIndex: machineryIdx,
    },
    namespace: namespace,
  });
  myMachineComponents.addReference({
    referenceType: "HasAddIn",
    nodeId: myMachine,
    isForward: false,
  });

  // ItemState + OperationMode

  const machineryBuildingBlocks = namespace.addObject({
    browseName: {
      name: "MachineryBuildingBlocks",
      namespaceIndex: machineryIdx,
    },
    typeDefinition: "FolderType",
    componentOf: myMachine,
  });

  const myItemState = (
    addressSpace!.findNode(`ns=${machineryIdx};i=1002`) as UAObjectType
  ).instantiate({
    browseName: {
      name: "MachineryItemState",
      namespaceIndex: machineryIdx,
    },
    namespace: namespace,
  });
  myItemState.addReference({
    referenceType: "HasAddIn",
    nodeId: machineryBuildingBlocks,
    isForward: false,
  });
  const myItemStateCurrentState = myItemState.getChildByName(
    "CurrentState",
  ) as UAVariable;
  myItemStateCurrentState?.setValueFromSource({
    dataType: DataType.LocalizedText,
    value: coerceLocalizedText("Executing"),
  });

  const myOperationMode = (
    addressSpace!.findNode(`ns=${machineryIdx};i=1008`) as UAObjectType
  ).instantiate({
    browseName: {
      name: "MachineryOperationMode",
      namespaceIndex: machineryIdx,
    },
    namespace: namespace,
  });
  myOperationMode.addReference({
    referenceType: "HasAddIn",
    nodeId: machineryBuildingBlocks,
    isForward: false,
  });
  const myOperationModeCurrentState = myOperationMode.getChildByName(
    "CurrentState",
  ) as UAVariable;
  myOperationModeCurrentState?.setValueFromSource({
    dataType: DataType.LocalizedText,
    value: coerceLocalizedText("Setup"),
  });

  initializeFakeDataSource(addressSpace);

  // ProcessValues

  const processValuesIdx = addressSpace!.getNamespaceIndex(
    "http://opcfoundation.org/UA/Machinery/ProcessValues/",
  );
  const processValuesType = addressSpace!.findNode(
    `ns=${processValuesIdx};i=1003`,
  ) as UAObjectType;
  const monitoringObject = namespace!.addObject({
    browseName: "Monitoring",
    nodeId: `ns=${namespace.index};s=Monitoring`,
    componentOf: myMachine,
  });

  const temperature = processValuesType.instantiate({
    browseName: {
      name: "Temperature",
      namespaceIndex: processValuesIdx,
    },
    namespace: namespace,
  });
  temperature.addReference({
    referenceType: "Organizes",
    nodeId: monitoringObject,
    isForward: false,
  });
  const temperaturTag = temperature.getChildByName("SignalTag") as UAVariable;
  temperaturTag?.setValueFromSource({
    dataType: DataType.String,
    value: "Temperature-Tag-123",
  });
  const temperatureAnalogSignal = temperature.getChildByName(
    "AnalogSignal",
  ) as UAVariable;
  temperatureAnalogSignal.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );
  const temperatureAnalogSignalEURange = temperatureAnalogSignal.getChildByName(
    "EURange",
  ) as UAVariable;
  temperatureAnalogSignalEURange.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );
  const temperatureAnalogSignalEngineeringUnits =
    temperatureAnalogSignal.getChildByName("EngineeringUnits") as UAVariable;
  temperatureAnalogSignalEngineeringUnits.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );

  const pressure = processValuesType.instantiate({
    browseName: {
      name: "Pressure",
      namespaceIndex: processValuesIdx,
    },
    namespace: namespace,
  });
  pressure.addReference({
    referenceType: "Organizes",
    nodeId: monitoringObject,
    isForward: false,
  });
  const pressureTag = pressure.getChildByName("SignalTag") as UAVariable;
  pressureTag?.setValueFromSource({
    dataType: DataType.String,
    value: "Pressure-Tag-123",
  });
  const pressureAnalogSignal = pressure.getChildByName(
    "AnalogSignal",
  ) as UAVariable;
  pressureAnalogSignal.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );
  const pressureAnalogSignalEURange = pressureAnalogSignal.getChildByName(
    "EURange",
  ) as UAVariable;
  pressureAnalogSignalEURange.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );
  const pressureAnalogSignalEngineeringUnits =
    pressureAnalogSignal.getChildByName("EngineeringUnits") as UAVariable;
  pressureAnalogSignalEngineeringUnits.bindVariable(
    {
      timestamped_get: variableGetter,
      // timestamped_set: variableSetter
    },
    true,
  );

  // instantiate components here -> organizedBy: myMachineComponents
};
