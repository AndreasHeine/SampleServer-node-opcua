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
    AddressSpace,
    UAObjectType,
    DataType,
    coerceLocalizedText,
    RaiseEventData,
    Variant,
    StatusCodes,
    AccessRestrictionsFlag,
    DataValue,
    ReadRawModifiedDetails,
} from 'node-opcua'

import { ServerRolePermissionGroup } from './../permissiongroups'

export const createOwnServerAddressspace = async (addressSpace: AddressSpace): Promise<void> => {
    const namespace = addressSpace?.getOwnNamespace()
    const diIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/DI/')
    
    const softwareType = addressSpace?.findNode(`ns=${diIdx};i=15106`) as UAObjectType
    const software = softwareType?.instantiate({
        browseName: 'SoftwareType',
        organizedBy: addressSpace.rootFolder.objects,
    })
    const model = software?.getPropertyByName('Model')
    model?.setValueFromSource({
        value: coerceLocalizedText('SampleServer-node-opcua'),
        dataType: DataType.LocalizedText,
    })

    const manufacturer = software?.getPropertyByName('Manufacturer')
    manufacturer?.setValueFromSource({
        value: coerceLocalizedText('Andreas Heine'),
        dataType: DataType.LocalizedText,
    })
    const softwareRevision = software?.getPropertyByName('SoftwareRevision')
    softwareRevision?.setValueFromSource({
        value: 'v1.0.0',
        dataType: DataType.String,
    })

    // Add DEV Object
    const dev = namespace.addObject({
        browseName: "DEV",
        organizedBy: addressSpace.rootFolder.objects,
        eventSourceOf: addressSpace.rootFolder.objects.server,
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
        accessRestrictions: AccessRestrictionsFlag.EncryptionRequired
    })

    // Add a own EventType
    const demoEvent = namespace.addEventType({
        browseName: "DemoEvent",
    })

    // Add TestEvents Object
    const testEvents = namespace.addObject({
        browseName: "TestEvents",
        organizedBy: dev,
        notifierOf: dev,
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
        accessRestrictions: AccessRestrictionsFlag.EncryptionRequired,
    })

    // Add the EventSource Object
    const myEvent = namespace.addObject({
        browseName: "myEvent",
        componentOf: testEvents,
        eventSourceOf: testEvents,
        eventNotifier: 1, // 0:None, 1:SubscribeToEvents, 2:HistoryRead, 3:HistoryWrite
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
        accessRestrictions: AccessRestrictionsFlag.EncryptionRequired,
    })

    // Create cyclic events with rising severity
    let count: number = 100
    setInterval(() => {
        count = count + 50
        if (count > 1000) {
            count = 100
        }
        const eventData: RaiseEventData = {
            message: new Variant({
                value: `Severity at: ${count}`,
                dataType: DataType.String,
            }),
            severity: new Variant({
                value: count,
                dataType: DataType.Int32,
            })
        }
        myEvent.raiseEvent(demoEvent, eventData)
    }, 10000)

    // Test variable with getter and setter
    const mySeverity = namespace.addVariable({
        browseName: "MySeverity",
        componentOf: dev,
        description: coerceLocalizedText("Value must be between 1000 and 100") || undefined,
        dataType: DataType.Int32,
        value: {
            get: () => {
                return new Variant({
                    value: count,
                    dataType: DataType.Int32
            })},
            set: (variant: Variant) => {
                if (variant.value > 1000 || variant.value < 100) {
                    return StatusCodes.BadOutOfRange
                } else {
                    count = variant.value
                    return StatusCodes.Good
                }
            }
        },
        eventSourceOf: dev,
    })

    // Timeout a Query if it takes to long!
    // https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
    const promiseWithTimeout = (prom: any, time: number) => {
        let timer: NodeJS.Timeout
        return Promise.race([
            prom,
            new Promise((_r, rej) => timer = setTimeout(rej, time))
        ]).finally(() => clearTimeout(timer))
    }

    // Historize "mySeverity"
    addressSpace?.installHistoricalDataNode(mySeverity, {
        maxOnlineValues: 100,
        // historian: {
        //     push(newDataValue: DataValue): Promise<void> {
        //         return new Promise(() => {
        //             // add DataValue to a Queue
        //         })
        //     },
        //     extractDataValues(historyReadRawModifiedDetails: ReadRawModifiedDetails, maxNumberToExtract: number, isReversed: boolean, reverseDataValue: boolean, callback: (err: Error, dataValue?: DataValue[]) => void): void {
                
        //         const query = new Promise((): DataValue[] => {
        //             // db querey here

        //             const data: DataValue[] = []
        //             return data
        //         })

        //         promiseWithTimeout(query, 10000)
        //         .then((data) => {

        //         })
        //         .catch((err) => {

        //         })
        //     },
        // },
    })

    // add ExclusiveLimitAlarm
    const alarm = namespace.instantiateExclusiveLimitAlarm("ExclusiveLimitAlarmType", {
        browseName: "MySeverityCondition",
        conditionName: "MySeverityCondition",
        componentOf: dev,
        conditionSource: mySeverity,
        highHighLimit: 800,
        highLimit: 600,
        inputNode: mySeverity,
        lowLimit: 400,
        lowLowLimit: 200,
        optionals: [
            "ConfirmedState", 
            "Confirm",
        ],
    })

    // Test var for RolePermissions and UserManager
    const mySecretVar = namespace.addVariable({
        browseName: "MySecretVar",
        componentOf: dev,
        description: coerceLocalizedText("Try change me!") || undefined,
        dataType: DataType.Int32,
        value: {
            value: 0,
            dataType: DataType.Int32
        },
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
        accessRestrictions: AccessRestrictionsFlag.EncryptionRequired,
    })
}