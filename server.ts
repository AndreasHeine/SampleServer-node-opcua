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
    OPCUAServer, 
    ServerState,
    coerceLocalizedText,
} from 'node-opcua'
import chalk from 'chalk'

import { config } from './config'
import { createAddressSpace } from './addressspace'

const server = new OPCUAServer(config)

const shutDown = ():void => {
    if (server.engine.serverStatus.state === ServerState.Shutdown) {
        console.log(chalk.yellow(` Server shutdown already requested... shutdown will happen in ${server.engine.serverStatus.secondsTillShutdown} second`))
        return
    }
    console.log(chalk.yellow(' Received server interruption from user '))
    console.log(chalk.yellow(' shutting down ...'))
    const reason = coerceLocalizedText('Shutdown by administrator')
    reason ? server.engine.serverStatus.shutdownReason = reason : null
    server.shutdown(10000, () => {
        console.log(chalk.yellow(' shutting down completed '))
        console.log(chalk.yellow(' done '))
        process.exit(0)
    })
}

const startUp = async (server: OPCUAServer): Promise<void> => {
    await server.start()
    console.log(chalk.green(' server started and ready on: '))
    console.log(chalk.green(` |--> ${server.getEndpointUrl()} `))
    console.log(chalk.green(` AlternateHostnames: ${config.alternateHostname} `))
    console.log(chalk.yellow(' CTRL+C to stop '))  
    process.on('SIGINT', shutDown)
    process.on('SIGTERM', shutDown)
}

(async () => {
    try {
        console.log(chalk.yellow(' starting server... '))
        await server.initialize()
        await createAddressSpace(server)
        server.engine.addressSpace?.installAlarmsAndConditionsService()
        await startUp(server)
    } catch (error) {
        console.log(chalk.red(' error ', error))
        process.exit(-1)
    }
})()