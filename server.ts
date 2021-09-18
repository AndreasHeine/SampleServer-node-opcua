// Copyright 2021 (c) Andreas Heine

import { 
    OPCUAServer, 
    ServerState,
    coerceLocalizedText, 
} from "node-opcua"

import { config } from "./config"
import { createAddressSpace} from "./addressspace"

const server = new OPCUAServer(config)

const startup = async () => {
    console.log(" starting server... ")
    await server.start()
    console.log(" server is ready on: ")
    server.endpoints.forEach(endpoint => console.log(" |--> ",endpoint.endpointDescriptions()[0].endpointUrl))
    console.log(" CTRL+C to stop ")  
    process.on("SIGINT", () => {
        if (server.engine.serverStatus.state === ServerState.Shutdown) {
            console.log(" Server shutdown already requested... shutdown will happen in ", server.engine.serverStatus.secondsTillShutdown, "second")
            return
        }
        console.log(" Received server interruption from user ")
        console.log(" shutting down ...")
        const reason = coerceLocalizedText("Shutdown by administrator")
        if (reason) {
            server.engine.serverStatus.shutdownReason = reason
        }
        server.shutdown(10000, () => {
        console.log(" shutting down completed ")
        console.log(" done ")
        process.exit(0)
        })
    })
}

(async () => {
    try {
        await server.initialize()
        await createAddressSpace(server)
        await startup()
    } catch (error) {
        console.log(" error ", error)
        process.exit(-1)
    }
})()