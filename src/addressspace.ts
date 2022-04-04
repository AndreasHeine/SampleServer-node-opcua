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
  OPCUAServer
} from 'node-opcua';

import { green } from './utils/log';

import { createOwnServerAddressspaceLogic } from './serveraddressspace/serveraddressspace';
import { createMyMachineLogic } from './machines/mymachine/mymachine';
import { createShowCaseMachineToolLogic } from './machines/machinetool/showcasemachinetool';
import { createSampleImmLogic } from './machines/sample_imm/sample_imm';
import { createSampleTcdLogic } from './machines/PlasticsRubber/sample_tcd';
import { createMotionDeviceSystemLogic } from './machines/motiondevicesystem/motiondevicesystem';

export const createAddressSpace = async (server: OPCUAServer): Promise<void> => {
  const addressSpace = server.engine.addressSpace;
  addressSpace
    ? await Promise.all([
      createOwnServerAddressspaceLogic(addressSpace),
      createMyMachineLogic(addressSpace),
      createShowCaseMachineToolLogic(addressSpace),
      createSampleImmLogic(addressSpace),
      createSampleTcdLogic(addressSpace),
      createMotionDeviceSystemLogic(addressSpace)
    ])
      .then(() => {
        green(' creating addressspace done! ');
      })
      .catch((error) => {
        throw new Error(` creating addressspace failed: ${error} `);
      })
    : () => {
        throw new Error(' addressSpace not found! the server has no \'addressSpace\' ');
      };
};
