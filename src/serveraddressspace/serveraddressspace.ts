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
    UAVariable,
    StatusCode,
    AddReferenceOpts,
    LocalizedText,
    UAObject,
    promoteToStateMachine,
    UATransitionEx,
    UAState,
    ConditionInfoOptions,
    coerceLocalizedText
} from 'node-opcua'


import { ServerRolePermissionGroup } from './../permissiongroups'
import { createMyFiniteStateMachineType } from './myfinitestatemachinetype'

export const createOwnServerAddressspaceLogic = async (addressSpace: AddressSpace): Promise<void> => {

    /*
        General Stuff:
    */

        const namespace = addressSpace?.getOwnNamespace()
        const diIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/DI/')

        const contributorType = namespace.addObjectType({
            browseName: 'ContributorType',
            subtypeOf: 'BaseObjectType'
        })

        namespace.addVariable({
            propertyOf: contributorType,
            browseName: 'Company',
            dataType: DataType.String,
            modellingRule: 'Mandatory'
        })

        namespace.addVariable({
            propertyOf: contributorType,
            browseName: 'Country',
            dataType: DataType.String,
            modellingRule: 'Mandatory'
        })

        namespace.addVariable({
            propertyOf: contributorType,
            browseName: 'Mail',
            dataType: DataType.String,
            modellingRule: 'Mandatory'
        })

        const contributorFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
            browseName: 'Contributors',
        })

        let contributor: UAObject
        let company: UAVariable
        let country: UAVariable
        let mail: UAVariable

        // Andreas Heine
        contributor = contributorType.instantiate({
            componentOf: contributorFolder,
            browseName: 'Andreas Heine',
            displayName: new LocalizedText({text: 'Andreas Heine'})
        })
        company = contributor.getChildByName('Company') as UAVariable
        company.setValueFromSource({
            value: 'konzeptpark GmbH',
            dataType: DataType.String
        })
        country = contributor.getChildByName('Country') as UAVariable
        country.setValueFromSource({
            value: 'Germany',
            dataType: DataType.String
        })
        mail = contributor.getChildByName('Mail') as UAVariable
        mail.setValueFromSource({
            value: 'info@andreas-heine.net',
            dataType: DataType.String
        })

        // Götz Görisch
        contributor = contributorType.instantiate({
            componentOf: contributorFolder,
            browseName: 'Götz Görisch',
            displayName: new LocalizedText({text: 'Götz Görisch'})
        })
        company = contributor.getChildByName('Company') as UAVariable
        company.setValueFromSource({
            value: 'VDW - Verein Deutscher Werkzeugmaschinenfabriken e.V.',
            dataType: DataType.String
        })
        country = contributor.getChildByName('Country') as UAVariable
        country.setValueFromSource({
            value: 'Germany',
            dataType: DataType.String
        })
        mail = contributor.getChildByName('Mail') as UAVariable
        mail.setValueFromSource({
            value: 'g.goerisch@vdw.de',
            dataType: DataType.String
        })

        // Harald Weber
        contributor = contributorType.instantiate({
            componentOf: contributorFolder,
            browseName: 'Harald Weber',
            displayName: new LocalizedText({text: 'Harald Weber'})
        })
        company = contributor.getChildByName('Company') as UAVariable
        company.setValueFromSource({
            value: 'VDMA',
            dataType: DataType.String
        })
        country = contributor.getChildByName('Country') as UAVariable
        country.setValueFromSource({
            value: 'Germany',
            dataType: DataType.String
        })
        mail = contributor.getChildByName('Mail') as UAVariable
        mail.setValueFromSource({
            value: 'harald.weber@vdma.org',
            dataType: DataType.String
        })

        // Etienne Rossignon
        contributor = contributorType.instantiate({
            componentOf: contributorFolder,
            browseName: 'Etienne Rossignon',
            displayName: new LocalizedText({text: 'Etienne Rossignon'})
        })
        company = contributor.getChildByName('Company') as UAVariable
        company.setValueFromSource({
            value: 'Sterfive',
            dataType: DataType.String
        })
        country = contributor.getChildByName('Country') as UAVariable
        country.setValueFromSource({
            value: 'France',
            dataType: DataType.String
        })
        mail = contributor.getChildByName('Mail') as UAVariable
        mail.setValueFromSource({
            value: 'etienne.rossignon@sterfive.com',
            dataType: DataType.String
        })   

        // Suprateek Banerjee
        contributor = contributorType.instantiate({
            componentOf: contributorFolder,
            browseName: 'Suprateek Banerjee',
            displayName: new LocalizedText({text: 'Suprateek Banerjee'})
        })
        company = contributor.getChildByName('Company') as UAVariable
        company.setValueFromSource({
            value: 'VDMA',
            dataType: DataType.String
        })
        country = contributor.getChildByName('Country') as UAVariable
        country.setValueFromSource({
            value: 'Germany',
            dataType: DataType.String
        })
        mail = contributor.getChildByName('Mail') as UAVariable
        mail.setValueFromSource({
            value: 'suprateek.banerjee@vdma.org',
            dataType: DataType.String
        })

    /*
        Showcase
    */

        const showcaseFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
            browseName: 'Showcases',
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
            subtypeOf:  'BaseEventType',
            isAbstract: false
        })

        const myEventRefs: AddReferenceOpts[] = [
            {
                nodeId: demoEvent,
                referenceType: 'GeneratesEvent'
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
            browseName: 'CustomDemoEventPropertie1',
            propertyOf: demoEvent,
            dataType: DataType.UInt64,
            modellingRule: 'Mandatory',
            value: new Variant({
                value: 0,
                dataType: DataType.UInt64
            })
        })

        namespace.addVariable({
            browseName: 'CustomDemoEventPropertie2',
            propertyOf: demoEvent,
            dataType: DataType.DateTime,
            modellingRule: 'Mandatory',
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
                get: function (this: UAVariable): Variant {
                    return new Variant({
                        value: myValue,
                        dataType: DataType.Double
                })},
                set: function(this: UAVariable, value: Variant): StatusCode {
                    myValue = value.value
                    return StatusCodes.Good
                }

            },
            eventSourceOf: showcaseAC,
        })

        const ownConditionEventType = namespace.addEventType({
            browseName: 'ownConditionEventType',
            subtypeOf:  'ConditionType',
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
            value: 'MyCondition is Good!',
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
            let condInfo: ConditionInfoOptions
            if (cond.message.readValue().value.value.text == 'MyCondition is Good!') {
                cond.severity.setValueFromSource({
                    value: 800,
                    dataType: DataType.UInt16
                })
        
                cond.message.setValueFromSource({
                    value: 'MyCondition is Bad!',
                    dataType: DataType.LocalizedText
                })
        
                cond.time.setValueFromSource({
                    value: new Date(),
                    dataType: DataType.DateTime
                })
                condInfo = {
                    retain: true,
                    message: coerceLocalizedText('MyCondition is Bad!'),
                    severity: 800
                }
            } else {
                cond.severity.setValueFromSource({
                    value: 150,
                    dataType: DataType.UInt16
                })
            
                cond.message.setValueFromSource({
                    value: 'MyCondition is Good!',
                    dataType: DataType.LocalizedText
                })
            
                cond.time.setValueFromSource({
                    value: new Date(),
                    dataType: DataType.DateTime
                })
                condInfo = {
                    retain: true,
                    message: coerceLocalizedText('MyCondition is Good!'),
                    severity: 150
                }
            }
            cond.raiseNewCondition(condInfo)
        }, 15000)
        
        const stringStateArray = ['Uncertain', 'Healthy', 'OutOfService', 'Maintenance']

        const multiStateDiscreteNode = namespace.addMultiStateDiscrete({
            browseName: 'offNormalInputNode',
            enumStrings: stringStateArray,
            value: 1
        })

        const normalStateNode = namespace.addMultiStateDiscrete({
            browseName: 'normalStateNode',
            enumStrings: stringStateArray,
            componentOf: showcaseAC,
            value: 1,
            accessLevel: 3,
            userAccessLevel: 3
        })

        const offnormalAlarm = namespace.instantiateOffNormalAlarm({
            browseName: 'SensorOffNormalAlarm',
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
            subtypeOf:  'NonExclusiveLimitAlarmType',
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
                'ConfirmedState', 'Confirm'
            ]
        })

        alarmConfirmable.retain.setValueFromSource({
            value: true,
            dataType: DataType.Boolean
        })

        const ownEventType2 = namespace.addEventType({
            browseName: 'ownExclusiveLimitAlarmType',
            subtypeOf:  'ExclusiveLimitAlarmType',
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
                'ConfirmedState', 'Confirm'
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
            userAccessLevel: 'CurrentRead'
        })

        let setpoint = 50
        let myDeg = 0
        let actual = 0

        const myHistoricalSetpointVar = namespace.addVariable({
            browseName: 'MyHistoricalSetpointVar',
            componentOf: showcaseHA,
            dataType: DataType.Double,
            userAccessLevel: 'CurrentRead | CurrentWrite',
            value: {
                get: function(this: UAVariable): Variant {
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
            rolePermissions: ServerRolePermissionGroup.DEFAULT,
        })

        await createMyFiniteStateMachineType(addressSpace)

        const myFiniteStateMachine = namespace.findObjectType('MyFiniteStateMachineType')!

        const demoFiniteStateMachineTypeInstance = myFiniteStateMachine.instantiate({
            displayName: 'MyFiniteStateMachineTypeInstance',
            browseName: 'MyFiniteStateMachineTypeInstance',
            componentOf: showcaseSta,
            optionals: [
                'AvailableStates',  
                'AvailableTransitions'
            ]
        })
        
        const demoFiniteStateMachine = promoteToStateMachine(demoFiniteStateMachineTypeInstance)

        const states = demoFiniteStateMachine.getStates()
        const statesNodeIds = states.map((value: UAState, index: number, array: UAState[]) => {
            return value.nodeId
        })
        const availableStates = demoFiniteStateMachine.getChildByName('AvailableStates') as UAVariable
        availableStates.setValueFromSource({
            value: statesNodeIds,
            dataType: DataType.NodeId
        })

        const transitions = demoFiniteStateMachine.getTransitions()
        const transitionsNodeIds = transitions.map((value: UATransitionEx, index: number, array: UATransitionEx[]) => {
            return value.nodeId
        })
        const availableTransitions = demoFiniteStateMachine.getChildByName('AvailableTransitions') as UAVariable
        availableTransitions.setValueFromSource({
            value: transitionsNodeIds,
            dataType: DataType.NodeId
        })
        
        const stateArray = ['Initializing', 'Idle', 'Prepare', 'Processing', 'Done']
        const transitionArray = []

        demoFiniteStateMachine.setState('Initializing')

        let stateCount = 0

        setInterval(() => {
            stateCount++
            if (stateCount >= stateArray.length) {
                stateCount = 1
                demoFiniteStateMachine.setState(stateArray[stateCount])
            } else {
                demoFiniteStateMachine.setState(stateArray[stateCount])
            }
        }, 10000)
    
    /*
        Showcase: Programs
        Part 10 Programs https://reference.opcfoundation.org/Core/docs/Part10/
    */
    
        // const showcasePrg = namespace.addObject({
        //     browseName: 'Programs',
        //     organizedBy: showcaseFolder,
        //     rolePermissions: ServerRolePermissionGroup.RESTRICTED,
        // })

        // const prgObjectType = addressSpace?.findNode(`ns=0;i=2391`) as UAObjectType

        // const demoPrg = prgObjectType?.instantiate({
        //     displayName: 'DemoProgram',
        //     browseName: 'DemoProgram',
        //     componentOf: showcasePrg,
        //     optionals: []
        // })

        // const demoPrgPromo = promoteToStateMachine(demoPrg)

        // demoPrgPromo.setState('Ready')
        // setTimeout(()=>{
        //     demoPrgPromo.setState('Running')
        // },5000)


    /*
        DEV: Testspace!!!
    */

    const dev = namespace.addObject({
        browseName: 'DEV',
        organizedBy: addressSpace.rootFolder.objects,
        rolePermissions: ServerRolePermissionGroup.DEFAULT,
    })

    const testView1 = namespace.addView({
        browseName: 'developer-view',
        organizedBy: addressSpace?.rootFolder.views
    })

    testView1.addReference({
        referenceType: 'Organizes',
        nodeId: dev.nodeId
    })

    testView1.addReference({
        referenceType: 'Organizes',
        nodeId: showcaseSta.nodeId
    })

    // testView1.addReference({
    //     referenceType: 'Organizes',
    //     nodeId: showcasePrg.nodeId
    // })
}
