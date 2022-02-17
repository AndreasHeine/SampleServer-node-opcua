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
    ConditionSnapshot,
    NodeId
} from 'node-opcua'

import { ServerRolePermissionGroup } from './../permissiongroups'

export const createOwnServerAddressspaceLogic = async (addressSpace: AddressSpace): Promise<void> => {

    /*
        General Stuff:
    */

    const namespace = addressSpace?.getOwnNamespace()
    const diIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/DI/')

    const softwareType = addressSpace?.findNode(`ns=${diIdx};i=15106`) as UAObjectType
    const software = softwareType?.instantiate({
        browseName: 'Info',
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

    /*
        Showcase
    */

    const showcaseFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: "Showcases",
    })
    
    /*
        Showcase: Events
    */

    const showcaseEV = namespace.addObject({
        browseName: 'Events',
        organizedBy: showcaseFolder,
        eventSourceOf: addressSpace.rootFolder.objects.server,
    })

    const myEvent = namespace.addObject({
        browseName: 'myEventNotifier',
        componentOf: showcaseEV,
        eventSourceOf: showcaseEV,
        eventNotifier: 1, // 0:None, 1:SubscribeToEvents, 2:HistoryRead, 3:HistoryWrite
    })

    const demoEvent = namespace.addEventType({
        browseName: 'DemoEventType',
        subtypeOf:  "BaseEventType",
        isAbstract: false
    })

    let count: number = 100
    setInterval(() => {
        count = count + 50
        if (count > 1000) {
            count = 100
        }
        const eventData: RaiseEventData = {
            message: new Variant({
                value: `New Event with Severity: ${count}`,
                dataType: DataType.String,
            }),
            severity: new Variant({
                value: count,
                dataType: DataType.Int32,
            })
        }
        myEvent.raiseEvent(demoEvent, eventData)
    }, 5000)

    /*
        Showcase: Alarms and Conditions
    */

    const showcaseAC = namespace.addObject({
        browseName: 'Alarms&Conditions',
        organizedBy: showcaseFolder,
        eventSourceOf: addressSpace.rootFolder.objects.server,
    })

    let myValue = 25
    setInterval(()=>{
        myValue+=1
        if (myValue >= 60) {
            myValue = -25;
        }
    }, 1000)

    const myVar = namespace.addVariable({
        browseName: 'MyVar',
        componentOf: showcaseAC,
        dataType: DataType.Double,
        value: {
            get: function (this) {
                return new Variant({
                    value: myValue,
                    dataType: DataType.Double
            })},
        },
        eventSourceOf: showcaseAC,
    })

    const ownConditionEventType = namespace.addEventType({
        browseName: 'ownConditionEventType',
        subtypeOf:  "ConditionType",
        isAbstract: false
    })

    const cond = namespace.instantiateCondition(ownConditionEventType, {
        browseName: 'MyCondition',
        conditionName: 'MyCondition',
        componentOf: showcaseAC,
        conditionSource: showcaseAC,
    })

    cond.severity.setValueFromSource({
        value: 150,
        dataType: DataType.UInt16
    })

    cond.message.setValueFromSource({
        value: "MyCondition is Good!",
        dataType: DataType.LocalizedText
    })

    cond.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    cond.time.setValueFromSource({
        value: new Date(),
        dataType: DataType.DateTime
    })

    setInterval(() => {
        if (cond.message.readValue().value.value.text == "MyCondition is Good!") {
            cond.severity.setValueFromSource({
                value: 800,
                dataType: DataType.UInt16
            })
    
            cond.message.setValueFromSource({
                value: "MyCondition is Bad!",
                dataType: DataType.LocalizedText
            })
    
            cond.time.setValueFromSource({
                value: new Date(),
                dataType: DataType.DateTime
            })
        } else {
            cond.severity.setValueFromSource({
                value: 150,
                dataType: DataType.UInt16
            })
        
            cond.message.setValueFromSource({
                value: "MyCondition is Good!",
                dataType: DataType.LocalizedText
            })
        
            cond.time.setValueFromSource({
                value: new Date(),
                dataType: DataType.DateTime
            })
        }
        let snap = new ConditionSnapshot(cond, new NodeId())
        cond.raiseConditionEvent(snap, true)
    }, 15000)


    const ownEventType = namespace.addEventType({
        browseName: 'ownNonExclusiveLimitAlarmType',
        subtypeOf:  "NonExclusiveLimitAlarmType",
        isAbstract: false
    })

    const alarm = namespace.instantiateNonExclusiveLimitAlarm(ownEventType, {
        browseName: 'MyVarNonExclusiveLimitAlarm',
        conditionName: 'MyVarNonExclusiveLimitAlarm',
        componentOf: showcaseAC,
        conditionSource: showcaseAC,
        highHighLimit: 50.0,
        highLimit: 40.0,
        inputNode: myVar,
        lowLimit: 20.0,
        lowLowLimit: -5.0,
    })

    alarm.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    const alarmConfirmable = namespace.instantiateNonExclusiveLimitAlarm(ownEventType, {
        browseName: 'MyVarConfirmableNonExclusiveLimitAlarm',
        conditionName: 'MyVarConfirmableNonExclusiveLimitAlarm',
        componentOf: showcaseAC,
        conditionSource: showcaseAC,
        highHighLimit: 50.0,
        highLimit: 40.0,
        inputNode: myVar,
        lowLimit: 20.0,
        lowLowLimit: -5.0,
        optionals: [
            "ConfirmedState", "Confirm"
        ]
    })

    alarmConfirmable.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    const ownEventType2 = namespace.addEventType({
        browseName: 'ownExclusiveLimitAlarmType',
        subtypeOf:  "ExclusiveLimitAlarmType",
        isAbstract: false
    })
    
    const alarm2 = namespace.instantiateExclusiveLimitAlarm(ownEventType2, {
        browseName: 'MyVarExclusiveLimitAlarm',
        conditionName: 'MyVarExclusiveLimitAlarm',
        componentOf: showcaseAC,
        conditionSource: showcaseAC,
        highHighLimit: 50.0,
        highLimit: 40.0,
        inputNode: myVar,
        lowLimit: 20.0,
        lowLowLimit: -5.0,
    })
    
    alarm2.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    const alarm2Confirmable = namespace.instantiateExclusiveLimitAlarm(ownEventType2, {
        browseName: 'MyVarConfirmableExclusiveLimitAlarm',
        conditionName: 'MyVarConfirmableExclusiveLimitAlarm',
        componentOf: showcaseAC,
        conditionSource: showcaseAC,
        highHighLimit: 50.0,
        highLimit: 40.0,
        inputNode: myVar,
        lowLimit: 20.0,
        lowLowLimit: -5.0,
        optionals: [
            "ConfirmedState", "Confirm"
        ]
    })
    
    alarm2Confirmable.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    /*
        Showcase: Historical Access
    */

        const showcaseHA = namespace.addObject({
            browseName: 'HistoricalAccess',
            organizedBy: showcaseFolder,
        })

        const myHistoricalVar = namespace.addVariable({
            browseName: 'MyHistoricalVar',
            componentOf: showcaseHA,
            dataType: DataType.Double,
        })

        const myHistoricalSetpointVar = namespace.addVariable({
            browseName: 'MyHistoricalSetpointVar',
            componentOf: showcaseHA,
            dataType: DataType.Double,
        })

        let setpoint = 50
        let myDeg = 0
        setInterval(()=>{
            myDeg+=1
            if (myDeg >= 360) {
                myDeg = 0;
            }
            myHistoricalVar.setValueFromSource(new Variant({
                value: Math.sin(myDeg) + setpoint,
                dataType: DataType.Double
            }))}, 1000)

        setInterval(()=>{
            if (setpoint === 50) {
                setpoint = 60
            } else {
                setpoint = 50
            }
        }, 120000)

        setInterval(()=>{
            myHistoricalSetpointVar.setValueFromSource(new Variant({
                value: setpoint,
                dataType: DataType.Double
        }))}, 5000)

        addressSpace?.installHistoricalDataNode(myHistoricalVar, {
            maxOnlineValues: 500,
        })

        addressSpace?.installHistoricalDataNode(myHistoricalSetpointVar, {
            maxOnlineValues: 500,
        })

    /*
        DEV: Testspace!!!
    */

    const dev = namespace.addObject({
        browseName: 'DEV',
        organizedBy: addressSpace.rootFolder.objects,
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
    })
}