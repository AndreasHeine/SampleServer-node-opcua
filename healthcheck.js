const nodeopcua = require("node-opcua");
const client = nodeopcua.OPCUAClient.create({endpointMustExist: false})
const ip = process.env.IP || "localhost"
const port = process.env.PORT || 4840
const url = `opc.tcp://${ip}:${port}`
client.connect(url, () => {})
client.disconnect(() => {})