// SPDX-License-Identifier: Apache-2.0
//
// Copyright (c) 2025 Alexander Inglessi
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
  coerceNodeId,
  DataType,
  UAVariable,
  AddressSpace,
  LocalizedText,
} from "node-opcua";
import model from "./power_model.json";

interface PowerState {
  mean: number;
  stddev: number;
}

interface PowerModel {
  unit: string;
  sampleIntervalSeconds: number;
  states: PowerState[];
  startProbabilities: number[];
  transitionMatrix: number[][];
}

// Simulates machine power using an HMM-derived set of operating states.
// Power levels and state transitions follow the statistical model learned from real measurements.
// Model parameters are read from power_model.json.
class PowerSimulator {
  private state: number;

  constructor(
    private readonly model: PowerModel,
    private readonly random: () => number = Math.random,
  ) {
    this.state = this.choose(model.startProbabilities);
  }

  public tick(): number {
    const state = this.model.states[this.state];
    const power = Math.max(0, state.mean + state.stddev * this.normalRandom());
    this.state = this.choose(this.model.transitionMatrix[this.state]);
    return power;
  }

  public getState(): number {
    return this.state;
  }

  private choose(probabilities: number[]): number {
    const r = this.random();
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (r < cumulative) {
        return i;
      }
    }
    return probabilities.length - 1;
  }

  private normalRandom(): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = this.random();
    while (v === 0) v = this.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}

export const createMachineToolEnergyLogic = async (
  addressSpace: AddressSpace,
): Promise<void> => {
  const idx = addressSpace?.getNamespaceIndex(
    "http://vdw.de/UA/MachineTool/Energy-Example/",
  );
  const iaIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/IA/",
  );
  const mtoolIdx = addressSpace?.getNamespaceIndex(
    "http://opcfoundation.org/UA/MachineTool/",
  );

  const simulator = new PowerSimulator(model);

  let powerKw = simulator.tick();

  setInterval(() => {
    powerKw = simulator.tick();
  }, model.sampleIntervalSeconds * 1000);

  setInterval(() => {
    const totalPowerW = powerKw * 1000;

    // Random phase voltages in V.
    const v1 = getRandomInRange(225, 235);
    const v2 = getRandomInRange(225, 235);
    const v3 = getRandomInRange(225, 235);

    // Small phase imbalance.
    const w1 = getRandomInRange(0.95, 1.05);
    const w2 = getRandomInRange(0.95, 1.05);
    const w3 = getRandomInRange(0.95, 1.05);

    const weightSum = w1 + w2 + w3;

    // Phase powers in W.
    const p1 = (totalPowerW * w1) / weightSum;
    const p2 = (totalPowerW * w2) / weightSum;
    const p3 = (totalPowerW * w3) / weightSum;

    // Phase currents in A.
    const c1 = p1 / v1;
    const c2 = p2 / v2;
    const c3 = p3 / v3;

    // Energy consumed during this one-second interval.
    // W × seconds / 3600 = Wh
    const e = totalPowerW / 3600;

    const newV = {
      L1: v1.toFixed(1),
      L2: v2.toFixed(1),
      L3: v3.toFixed(1),
    };

    const newC = {
      L1: c1.toFixed(3),
      L2: c2.toFixed(3),
      L3: c3.toFixed(3),
    };

    const newP = {
      L1: p1.toFixed(0),
      L2: p2.toFixed(0),
      L3: p3.toFixed(0),
    };

    const voltage = addressSpace?.findNode(`ns=${idx};i=6196`) as UAVariable;

    voltage?.setValueFromSource({
      value: newV,
      dataType: DataType.ExtensionObject,
    });

    const current = addressSpace?.findNode(`ns=${idx};i=6212`) as UAVariable;

    current?.setValueFromSource({
      value: newC,
      dataType: DataType.ExtensionObject,
    });

    const power = addressSpace?.findNode(`ns=${idx};i=6147`) as UAVariable;

    power?.setValueFromSource({
      value: newP,
      dataType: DataType.ExtensionObject,
    });

    const energyImport = addressSpace?.findNode(
      `ns=${idx};i=6164`,
    ) as UAVariable;

    const oldE = energyImport.readValue().value.value;

    energyImport?.setValueFromSource({
      value: parseFloat((oldE + e).toFixed(3)),
      dataType: DataType.Double,
    });
  }, 1000);

  // changes CurrentState each 10000 msec from Running to Interrupted
  setInterval(() => {
    const state = addressSpace?.findNode(`ns=${idx};i=6144`) as UAVariable;
    const stateId = addressSpace?.findNode(`ns=${idx};i=6145`) as UAVariable;
    const stateNumber = addressSpace?.findNode(
      `ns=${idx};i=6146`,
    ) as UAVariable;
    if (state?.readValue().value.value.text === "Running") {
      state?.setValueFromSource({
        value: new LocalizedText({ text: "Interrupted", locale: "en" }),
        dataType: DataType.LocalizedText,
      });
      stateId.setValueFromSource({
        value: coerceNodeId(`ns=${mtoolIdx};i=5040`),
        dataType: DataType.NodeId,
      });
      stateNumber.setValueFromSource({
        value: 3,
        dataType: DataType.UInt32,
      });
    } else {
      state?.setValueFromSource({
        value: new LocalizedText({ text: "Running", locale: "en" }),
        dataType: DataType.LocalizedText,
      });
      stateId.setValueFromSource({
        value: coerceNodeId(`ns=${mtoolIdx};i=5041`),
        dataType: DataType.NodeId,
      });
      stateNumber.setValueFromSource({
        value: 1,
        dataType: DataType.UInt32,
      });
    }
  }, 10000);

  // Simulate water flow fluctuiation every 1 sec.
  setInterval(() => {
    const waterFlow = addressSpace?.findNode(`ns=${idx};i=6256`) as UAVariable;
    waterFlow?.setValueFromSource({
      value: getRandomInRange(1.1, 1.3).toFixed(3),
      dataType: DataType.Float,
    });
  }, 1000);

  // Simulate air flow fluctuiation every 1 sec.
  setInterval(() => {
    const airFlow = addressSpace?.findNode(`ns=${idx};i=6266`) as UAVariable;
    airFlow?.setValueFromSource({
      value: getRandomInRange(1.4, 1.6).toFixed(3),
      dataType: DataType.Float,
    });
  }, 1000);

  // Inctrease PowerOnDuration every 1 min.
  setInterval(() => {
    const powerOnDuration = addressSpace?.findNode(
      `ns=${idx};i=6333`,
    ) as UAVariable;
    const oldT = powerOnDuration.readValue().value.value;
    powerOnDuration?.setValueFromSource({
      value: oldT + 60000,
      dataType: DataType.Double,
    });
  }, 60000);

  function getRandomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
};
