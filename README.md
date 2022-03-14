# SampleServer-node-opcua

[![Node.js CI](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/node.js.yml/badge.svg)](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/codeql-analysis.yml)
[![Lint Code Base](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/linter.yml/badge.svg)](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/linter.yml)
[![Container Build](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/container_build.yml/badge.svg)](https://github.com/AndreasHeine/SampleServer-node-opcua/actions/workflows/container_build.yml)  

OPC UA Sample Server based on [node-opcua](https://github.com/node-opcua/node-opcua)  
the book from the author of node-opcua: [node-opcuabyexample](https://leanpub.com/node-opcuabyexample)  
API Docs: [2.32.0](https://node-opcua.github.io/api_doc/2.32.0/index.html)  
  
## Requirements

Node.js v14 (LTS) or newer  
TypeScript globally installed for tsc cli (`npm install -g typescript`)  
pkg globally installed for pkg cli (`npm install -g pkg`)  
  
## Usage

- `download and unpack`  
- `open folder in VS Code (or in terminal)`  
- `npm install`  
- `npm run start`

## Example Users

User: `admin` Password: `pw1` Role: Supervisor  
User: `operator` Password: `pw2` Role: Operator  
User: `guest` Password: `pw3` Role: AuthenticatedUser  

## Ephemeral Dev Environment

- [Click](https://gitpod.io/#https://github.com/AndreasHeine/SampleServer-node-opcua)
- `npm run start`
- split terminal: `opcua-commander -e opc.tcp://localhost:4840/UA` to have a local OPC UA client
  
## Docker  

Set "IP" and "PORT" in env:

- `docker run -it -p 4840:4840 -e PORT=4840 -e IP=127.0.0.1 --name sampleserver-node-opcua ghcr.io/andreasheine/sampleserver-node-opcua:main`  
  
## Online Server Instance  

- `opc.tcp://opcua3.umati.app:4840`  
  
## Implementations of OPC UA Companion Specifications
  
![image](https://user-images.githubusercontent.com/56362817/155572699-848e0deb-5ae4-4197-987c-4b602b309f54.png)
  
## License

![GitHub](https://img.shields.io/github/license/AndreasHeine/SampleServer-node-opcua)

Unless otherwise specified, source code in this repository is licensed under the [Apache 2.0 License](LICENSE).
