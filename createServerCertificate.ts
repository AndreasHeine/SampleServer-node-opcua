// Copyright 2021 (c) Andreas Heine
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import child_process from "child_process"
import fs from "fs"
import os from "os"
import path from "path"

import { config } from "./config"

const serverCertificate = "cert.pem"
const applicationUri = config.buildInfo?.productUri

const certOptions = {
    subject: {
        commonName:         applicationUri,
        organization:       "AndreasHeine",
        organizationUnit:   "DEV",
        locality:           "Bad Hersfeld",
        state:              "HE",
        country:            "DE" // Two letters
    },
    validity:           365 * 15, // 15 years
    keySize:            2048 // default private key size : 2048, 3072 or 4096 (avoid 1024 too weak)
}

const getMyIpAddresses = ():String[] => {
    const ipAddresses = [];
	const ifaces = os.networkInterfaces();
	for (let ifname of Object.keys(ifaces)) {
		const networkInterface = ifaces[ifname];
		if (networkInterface) {
			for (let iface of networkInterface) {
				if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				continue;
				}
				ipAddresses.push(iface.address);
			}
		}
	}
    return ipAddresses;
}

const ipAddresses = getMyIpAddresses();

const fileExists = async (path:any) => {
  	return await new Promise((resolve, reject) =>
    	fs.access(path, fs.constants.F_OK, (err) => resolve(!err))
  	);
}

const exec = async (cmd:any) => {
  	console.log("Executing ", cmd);
  	const promise = new Promise((resolve, reject) => {
    	const child = child_process.exec(cmd, function(err) {
    });
    child.stdout?.pipe(process.stdout);
    child.on("close", (code:Number) => {
      	console.log("done ... (" + code + ")");
      	if (code == 0) {
        	resolve(null);
      	} else {
        	reject(new Error("command ended with code " + code));
      	}
    });
  });
  await promise;
}

const createSelfSignedCertificate = async (ipAddresses:String[], serverCertificate:String) => {
	const args = [
		"node", "node_modules/node-opcua-pki/bin/crypto_create_CA.js",
		// command
		"certificate",
		// arguments
		"-s", "-o", serverCertificate,
		"--ip", ipAddresses.join(","),
		"-a", applicationUri
	];
	await exec(args.join(" "));
}

export const createServerCertificate = async () => {
	const serverCertificateExist = await fileExists(serverCertificate);
	if (!serverCertificateExist) {
		await createSelfSignedCertificate(ipAddresses, serverCertificate);
		console.log(" serverCertificate ", serverCertificate, "created");
	}
}