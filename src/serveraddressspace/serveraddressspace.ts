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
    NodeId,
    UAVariable,
    StatusCode,
    promoteToStateMachine,
    UAFiniteStateMachineType
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
        notifierOf: addressSpace.rootFolder.objects.server
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

    namespace.addVariable({
        browseName: "CustomDemoEventPropertie1",
        propertyOf: demoEvent,
        dataType: DataType.UInt64,
        modellingRule: "Mandatory",
        value: new Variant({
            value: 0,
            dataType: DataType.UInt64
        })
    })

    namespace.addVariable({
        browseName: "CustomDemoEventPropertie2",
        propertyOf: demoEvent,
        dataType: DataType.DateTime,
        modellingRule: "Mandatory",
        value: new Variant({
            value: null,
            dataType: DataType.DateTime
        })
    })

    demoEvent.install_extra_properties()

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
            }),
            customDemoEventPropertie1: new Variant({
                value: 1234,
                dataType: DataType.UInt64,
            }),
            customDemoEventPropertie2: new Variant({
                value: new Date(),
                dataType: DataType.DateTime,
            })
        }
        myEvent.raiseEvent(demoEvent, eventData)
    }, 5000)

    /*
        Showcase: Alarms and Conditions
        Part 9 Alarms & Conditions https://reference.opcfoundation.org/Core/docs/Part9/
    */

    const showcaseAC = namespace.addObject({
        browseName: 'Alarms&Conditions',
        organizedBy: showcaseFolder,
        eventSourceOf: addressSpace.rootFolder.objects.server,
        eventNotifier: 1
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
        conditionSource: myVar,
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
        conditionSource: myVar,
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
        conditionSource: myVar,
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
        conditionSource: myVar,
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
        Part 11 Historical Access https://reference.opcfoundation.org/Core/docs/Part11/
    */

    const showcaseHA = namespace.addObject({
        browseName: 'HistoricalAccess',
        organizedBy: showcaseFolder,
    })

    const myHistoricalVar = namespace.addVariable({
        browseName: 'MyHistoricalVar',
        componentOf: showcaseHA,
        dataType: DataType.Double,
        userAccessLevel: "CurrentRead"
    })

    let setpoint = 50
    let myDeg = 0
    let actual = 0

    const myHistoricalSetpointVar = namespace.addVariable({
        browseName: 'MyHistoricalSetpointVar',
        componentOf: showcaseHA,
        dataType: DataType.Double,
        userAccessLevel: "CurrentRead | CurrentWrite",
        value: {
            get: function(): Variant {
                return new Variant({
                    value: setpoint,
                    dataType: DataType.Double
                })
            },
            set: function(this: UAVariable, value: Variant): StatusCode {
                setpoint = value.value
                return StatusCodes.Good
            }
        }
    })

    setInterval(() => {
        myHistoricalSetpointVar.setValueFromSource(new Variant({
            value: setpoint,
            dataType: DataType.Double
            })
        )
    }, 5000)

    setInterval(()=>{
        myDeg+=1
        if (myDeg >= 360) {
            myDeg = 0;
        }
        actual = Math.sin(myDeg) + setpoint
        myHistoricalVar.setValueFromSource(new Variant({
            value: actual,
            dataType: DataType.Double
            })
        )
    }, 1000)

    addressSpace?.installHistoricalDataNode(myHistoricalVar, {
        maxOnlineValues: 10000,
    })

    addressSpace?.installHistoricalDataNode(myHistoricalSetpointVar, {
        maxOnlineValues: 2000,
    })

    /*
        Showcase: State Machines
        Part 16 State Machines https://reference.opcfoundation.org/Core/docs/Part16/
    */

    const showcaseSta = namespace.addObject({
        browseName: 'StateMachines',
        organizedBy: showcaseFolder,
    })

    const myFiniteStateMachine = namespace.addObjectType({
        browseName: "MyFiniteStateMachine",
        subtypeOf: "FiniteStateMachineType"
    }) as UAFiniteStateMachineType
    
    const demoFiniteStateMachineTypeInstance = myFiniteStateMachine.instantiate({
        displayName: "DemoFiniteStateMachineTypeInstance",
        browseName: "DemoFiniteStateMachineTypeInstance",
        componentOf: showcaseSta,
        optionals: [
            "AvailableStates", "LastTransition", "AvailableTransitions"
        ]
    })

    const demoFiniteStateMachine = promoteToStateMachine(demoFiniteStateMachineTypeInstance)

    namespace.addState(demoFiniteStateMachine, "Initializing", 100, true)
    namespace.addState(demoFiniteStateMachine, "Idle", 200)
    namespace.addState(demoFiniteStateMachine, "Prepare", 300)
    namespace.addState(demoFiniteStateMachine, "Processing", 400)
    namespace.addState(demoFiniteStateMachine, "Done", 500)

    namespace.addTransition(demoFiniteStateMachine, "Initializing", "Idle", 1)
    namespace.addTransition(demoFiniteStateMachine, "Idle", "Prepare", 2)
    namespace.addTransition(demoFiniteStateMachine, "Prepare", "Processing", 3)
    namespace.addTransition(demoFiniteStateMachine, "Processing", "Done", 4)
    namespace.addTransition(demoFiniteStateMachine, "Done", "Idle", 5)

    // console.log("States: ", demoFiniteStateMachine.getStates())
    // console.log("Transitions: ", demoFiniteStateMachine.getTransitions())

    demoFiniteStateMachine.setState(demoFiniteStateMachine.initialState!)

    // https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.state.html
    // https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.statemachine.html
    // https://github.com/node-opcua/node-opcua/blob/master/packages/node-opcua-address-space/src/namespace_impl.ts#L1427


    /*
        Showcase: Programs
        Part 10 Programs https://reference.opcfoundation.org/Core/docs/Part10/
    */

        const showcasePrg = namespace.addObject({
            browseName: 'Programs',
            organizedBy: showcaseFolder,
            rolePermissions: ServerRolePermissionGroup.RESTRICTED,
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