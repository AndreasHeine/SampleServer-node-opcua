// Copyright 2021 (c) Andreas Heine

import { 
    OPCUAServer, 
} from "node-opcua"

import { createMyMachine} from "./machines/mymachine/mymachine"
import { createShowCaseMachineTool} from "./machines/machinetool/showcasemachinetool"
import { createSampleImm} from "./machines/sample_imm/sample_imm"

export const createAddressSpace = async (server: OPCUAServer) => {
    const addressSpace = server.engine.addressSpace
    if (addressSpace) {  
        await Promise.all([
            createMyMachine(addressSpace),
            createShowCaseMachineTool(addressSpace),
            createSampleImm(addressSpace),
        ])
        .then(() => {
            console.log(" creating addressspace done! ")
        })
        .catch((error) => {
            throw new Error(` creating addressspace failed: ${error} `)
        }
        )
    } else {
        throw new Error(` addressSpace not found! the server has no "addressSpace" property of type AdressSpace `)
    }
}