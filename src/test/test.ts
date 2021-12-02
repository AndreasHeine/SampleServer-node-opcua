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

import { describe, it } from "mocha"
import { expect } from "chai"

import { 
    OPCUAServer, 
} from 'node-opcua'

import { config } from "./../config"

describe('Tests:', () => {
    let server: OPCUAServer
    beforeEach((done) => {
        server = new OPCUAServer(config)
        server.initialize()
        server.start(() => {
            done()
        });
    });
    afterEach((done) => {
        if (server) {
            server.shutdown(() => {
                done()
            });
        } else {
            done()
        }
    });

    it('should start the OPCUAServer', () => { 
        //        
    })
})