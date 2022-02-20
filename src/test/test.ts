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

import { describe, it } from 'mocha';

import { 
    OPCUAServer, 
} from 'node-opcua';

import { config } from './../config';
import { createAddressSpace } from './../addressspace';

describe('following tests are for renovate dependency updates:', function () {
    this.timeout(35000);
    const server = new OPCUAServer(config);

    const startup = async function () {
        await server.initialize();
        await createAddressSpace(server);
        server.engine.addressSpace?.installAlarmsAndConditionsService();
        await server.start();
    }

    const stutdown = function () {
        server.shutdown(() => {
            server.dispose();
        })
    }

    it('should start the OPCUAServer', async function () { 
        return new Promise((resolve) => {
            startup().then(
                () => {
                    console.log('  --> server is running for 20s...  ');
                    setTimeout(() => {
                        resolve();
                    }, 20000)
                }
            );
        });      
    });

    it('should stop the OPCUAServer', function () {
        stutdown();
        console.log('  --> server is shutting down...  ');
        setTimeout(()=>{
            return
        }, 5000)
    })
});