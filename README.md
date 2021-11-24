# SampleServer-node-opcua

OPC UA Sample Server based on [node-opcua](https://github.com/node-opcua/node-opcua)  
the book from the author of node-opcua: [node-opcuabyexample](https://leanpub.com/node-opcuabyexample)  
API Docs: [2.32.0](https://node-opcua.github.io/api_doc/2.32.0/index.html)  
  
## Requirements  
node v14 (LTS) or newer  
typescript globally installed for tsc cli (`npm install -g typescript`)  
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

Create the docker image:  
- `docker build . -t sampleserver`  

Set "IP" and "PORT" in env:  
- `docker run -it -p 5000:5000 -e PORT=5000 -e IP=127.0.0.1 --name test_server sampleserver`  
  
## Build 
if you want to build an executable  
`tsc && pkg server.js`
  
## Implementations of OPC UA Companion Specifications
  
![grafik](https://user-images.githubusercontent.com/56362817/131531865-bb006b44-cdea-4582-9ffd-dcba816caee7.png)
  
## License

![GitHub](https://img.shields.io/github/license/AndreasHeine/SampleServer-node-opcua)

Unless otherwise specified, source code in this repository is licensed under the [Apache 2.0 License](LICENSE).
