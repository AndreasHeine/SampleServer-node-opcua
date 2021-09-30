# SampleServer-node-opcua

OPC UA Sample Server based on [node-opcua](https://github.com/node-opcua/node-opcua)  
the book from the author of node-opcua: [node-opcuabyexample](https://leanpub.com/node-opcuabyexample)  
API Docs: [2.32.0](https://node-opcua.github.io/api_doc/2.32.0/index.html)  
  
## Requirments  
node v14 (LTS) or newer  
typescript globally installed for tsc cli (`npm install -g typescript`)  
pkg globally installed for pkg cli (`npm install -g pkg`)  
  
## Usage   
`1. download and unpack`  
`2. open folder in VS Code (or in terminal)`  
`3. npm install`  
`4. npm run start`
  
## Build 
if you want to build an executable  
`tsc && pkg -t server.js`
  
## Implementations of OPC UA Companion Specifications
  
![grafik](https://user-images.githubusercontent.com/56362817/131531865-bb006b44-cdea-4582-9ffd-dcba816caee7.png)
  
## License

![GitHub](https://img.shields.io/github/license/AndreasHeine/SampleServer-node-opcua)

Unless otherwise specified, source code in this repository is licensed under the [Apache 2.0 License](LICENSE).