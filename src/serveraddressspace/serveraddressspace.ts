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
    DataType,
    RaiseEventData,
    Variant,
    StatusCodes,
    ConditionSnapshot,
    NodeId,
    UAVariable,
    StatusCode,
    AddReferenceOpts,
    LocalizedText,
    UAObject,
    promoteToStateMachine,
    UAObjectType
} from 'node-opcua'

import { ServerRolePermissionGroup } from './../permissiongroups'

export const createOwnServerAddressspaceLogic = async (addressSpace: AddressSpace): Promise<void> => {

    /*
        General Stuff:
    */

    const namespace = addressSpace?.getOwnNamespace()
    const diIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/DI/')

    const contributorType = namespace.addObjectType({
        browseName: "ContributorType",
        subtypeOf: "BaseObjectType"
    })

    namespace.addVariable({
        propertyOf: contributorType,
        browseName: "Company",
        dataType: DataType.String,
        modellingRule: "Mandatory"
    })

    namespace.addVariable({
        propertyOf: contributorType,
        browseName: "Country",
        dataType: DataType.String,
        modellingRule: "Mandatory"
    })

    namespace.addVariable({
        propertyOf: contributorType,
        browseName: "Mail",
        dataType: DataType.String,
        modellingRule: "Mandatory"
    })

    const contributorFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: "Contributors",
    })

    let contributor: UAObject
    let company: UAVariable
    let country: UAVariable
    let mail: UAVariable

    // Andreas Heine
    contributor = contributorType.instantiate({
        componentOf: contributorFolder,
        browseName: "Andreas Heine",
        displayName: new LocalizedText({text: "Andreas Heine"})
    })
    company = contributor.getChildByName("Company") as UAVariable
    company.setValueFromSource({
        value: "konzeptpark GmbH",
        dataType: DataType.String
    })
    country = contributor.getChildByName("Country") as UAVariable
    country.setValueFromSource({
        value: "Germany",
        dataType: DataType.String
    })
    mail = contributor.getChildByName("Mail") as UAVariable
    mail.setValueFromSource({
        value: "info@andreas-heine.net",
        dataType: DataType.String
    })

    // Götz Görisch
    contributor = contributorType.instantiate({
        componentOf: contributorFolder,
        browseName: "Götz Görisch",
        displayName: new LocalizedText({text: "Götz Görisch"})
    })
    company = contributor.getChildByName("Company") as UAVariable
    company.setValueFromSource({
        value: "VDW - Verein Deutscher Werkzeugmaschinenfabriken e.V.",
        dataType: DataType.String
    })
    country = contributor.getChildByName("Country") as UAVariable
    country.setValueFromSource({
        value: "Germany",
        dataType: DataType.String
    })
    mail = contributor.getChildByName("Mail") as UAVariable
    mail.setValueFromSource({
        value: "g.goerisch@vdw.de",
        dataType: DataType.String
    })

    // Harald Weber
    contributor = contributorType.instantiate({
        componentOf: contributorFolder,
        browseName: "Harald Weber",
        displayName: new LocalizedText({text: "Harald Weber"})
    })
    company = contributor.getChildByName("Company") as UAVariable
    company.setValueFromSource({
        value: "VDMA",
        dataType: DataType.String
    })
    country = contributor.getChildByName("Country") as UAVariable
    country.setValueFromSource({
        value: "Germany",
        dataType: DataType.String
    })
    mail = contributor.getChildByName("Mail") as UAVariable
    mail.setValueFromSource({
        value: "harald.weber@vdma.org",
        dataType: DataType.String
    })

    // Etienne Rossignon
    contributor = contributorType.instantiate({
        componentOf: contributorFolder,
        browseName: "Etienne Rossignon",
        displayName: new LocalizedText({text: "Etienne Rossignon"})
    })
    company = contributor.getChildByName("Company") as UAVariable
    company.setValueFromSource({
        value: "Sterfive",
        dataType: DataType.String
    })
    country = contributor.getChildByName("Country") as UAVariable
    country.setValueFromSource({
        value: "France",
        dataType: DataType.String
    })
    mail = contributor.getChildByName("Mail") as UAVariable
    mail.setValueFromSource({
        value: "etienne.rossignon@sterfive.com",
        dataType: DataType.String
    })   

    // Suprateek Banerjee
    contributor = contributorType.instantiate({
        componentOf: contributorFolder,
        browseName: "Suprateek Banerjee",
        displayName: new LocalizedText({text: "Suprateek Banerjee"})
    })
    company = contributor.getChildByName("Company") as UAVariable
    company.setValueFromSource({
        value: "VDMA",
        dataType: DataType.String
    })
    country = contributor.getChildByName("Country") as UAVariable
    country.setValueFromSource({
        value: "Germany",
        dataType: DataType.String
    })
    mail = contributor.getChildByName("Mail") as UAVariable
    mail.setValueFromSource({
        value: "suprateek.banerjee@vdma.org",
        dataType: DataType.String
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

    const demoEvent = namespace.addEventType({
        browseName: 'DemoEventType',
        subtypeOf:  "BaseEventType",
        isAbstract: false
    })

    const myEventRefs: AddReferenceOpts[] = [
        {
            nodeId: demoEvent,
            referenceType: "GeneratesEvent"
        }
    ]

    const myEvent = namespace.addObject({
        browseName: 'myEventNotifier',
        componentOf: showcaseEV,
        eventSourceOf: showcaseEV,
        eventNotifier: 1, // 0:None, 1:SubscribeToEvents, 2:HistoryRead, 3:HistoryWrite
        references: myEventRefs
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
    
    const stringStateArray = ["Uncertain", "Healthy", "OutOfService", "Maintenance"]

    const multiStateDiscreteNode = namespace.addMultiStateDiscrete({
        browseName: "offNormalInputNode",
        enumStrings: stringStateArray,
        value: 1
    })

    const normalStateNode = namespace.addMultiStateDiscrete({
        browseName: "normalStateNode",
        enumStrings: stringStateArray,
        componentOf: showcaseAC,
        value: 1,
        accessLevel: 3,
        userAccessLevel: 3
    })

    const offnormalAlarm = namespace.instantiateOffNormalAlarm({
        browseName: "SensorOffNormalAlarm",
        conditionSource: showcaseAC,
        componentOf: showcaseAC,
        inputNode: multiStateDiscreteNode,
        normalState: normalStateNode
    })

    offnormalAlarm.retain.setValueFromSource({
        value: true,
        dataType: DataType.Boolean
    })

    setInterval(() => {
        let randomIdx = Math.floor(Math.random()*stringStateArray.length)
        if (randomIdx != 1) {
            offnormalAlarm.severity.setValueFromSource({
                value: 600,
                dataType: DataType.UInt16
            })
        } else {
            offnormalAlarm.severity.setValueFromSource({
                value: 200,
                dataType: DataType.UInt16
            })
        }
        normalStateNode.setValueFromSource({
            value: randomIdx,
            dataType: DataType.UInt32
        })
    }, 60000)

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
        Showcase: Programs
    */

    const showcasePrg = namespace.addObject({
        browseName: 'Programs',
        organizedBy: showcaseFolder,
    })

    const statemachineType = addressSpace.findNode("StateMachineType") as UAObjectType

    const demoStatemachineInstance = statemachineType.instantiate({
        displayName: "DemoStatmachineTypeInstance",
        browseName: "DemoStatmachineTypeInstance",
        componentOf: showcasePrg,
        // optionals: [
        //     "LastTransition"
        // ]
    })

    const demoStatemachine = promoteToStateMachine(demoStatemachineInstance)

    const state1 = namespace.addState(demoStatemachine, "Initializing", 1, true)
    const state2 = namespace.addState(demoStatemachine, "Idle", 2)
    const state3 = namespace.addState(demoStatemachine, "Prepare", 3)
    const state4 = namespace.addState(demoStatemachine, "Processing", 4)
    const state5 = namespace.addState(demoStatemachine, "Done", 5)

    const trans1 = namespace.addTransition(demoStatemachine, "Initializing", "Idle", 1)
    const trans2 = namespace.addTransition(demoStatemachine, "Idle", "Prepare", 2)
    const trans3 = namespace.addTransition(demoStatemachine, "Prepare", "Processing", 3)
    const trans4 = namespace.addTransition(demoStatemachine, "Processing", "Done", 4)
    const trans5 = namespace.addTransition(demoStatemachine, "Done", "Idle", 5)

    demoStatemachine.setState(state1)

    // https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.state.html
    // https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.statemachine.html
    // https://github.com/node-opcua/node-opcua/blob/master/packages/node-opcua-address-space/src/namespace_impl.ts#L1427

    // Demo cylce + TransitionEvents


    /*
        DEV: Testspace!!!
    */

    const dev = namespace.addObject({
        browseName: 'DEV',
        organizedBy: addressSpace.rootFolder.objects,
        rolePermissions: ServerRolePermissionGroup.RESTRICTED,
    })

    const testView1 = namespace.addView({
        browseName: "developer-view",
        organizedBy: addressSpace?.rootFolder.views
    })

    testView1.addReference({
        referenceType: "Organizes",
        nodeId: dev.nodeId
    })
}