// Copyright 2024 (c) Andreas Heine
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
    InstantiateObjectOptions,
    LocalizedText,
    setNamespaceMetaData,
    UADataType,
    UAObject,
    UAObjectType,
    UAVariable,
    Variant,
    standardUnits,
    UAMethod,
    ISessionContext,
    CallbackT,
    CallMethodResultOptions,
    StatusCodes,
    DataValue
} from 'node-opcua'
import { ServerRolePermissionGroup } from '../../permissiongroups'
import { ISA95JobOrderDataType, JobItem } from './interfaces'
import { ISA95_Method_ReturnCode } from './enums'

export const createJobContolLogic = async (addressSpace: AddressSpace): Promise<void> => {
    const machineryIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/Machinery/')
    const machinesFolder = addressSpace?.findNode(`ns=${machineryIdx};i=1001`) as UAObject

    const namespace = addressSpace?.registerNamespace('http://MyControledMachine-Namespace/UA')
    namespace.setDefaultRolePermissions(ServerRolePermissionGroup.DEFAULT)
    setNamespaceMetaData(namespace)

    const controledMachine = namespace?.addObject({
        browseName: 'MyControledMachine',
        nodeId: `ns=${namespace.index};s=MyControledMachine`,
        organizedBy: machinesFolder,
    })

    const jobIdx = addressSpace?.getNamespaceIndex('http://opcfoundation.org/UA/Machinery/Jobs/')
    const jobManagementType = addressSpace?.findNode(`ns=${jobIdx};i=1003`) as UAObjectType

    const jobManager = jobManagementType.instantiate({
        componentOf: controledMachine,
        browseName: `JobManager`,
        namespace: namespace,
        optionals: [
            // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/6.2.1
            "JobOrderControl.StoreAndStart",
            "JobOrderControl.Store",
            "JobOrderControl.Start",
            "JobOrderControl.Update",
            "JobOrderControl.Stop",
            "JobOrderControl.Cancel",
            "JobOrderControl.Clear",
            "JobOrderControl.RevokeStart",
            "JobOrderControl.Pause",
            "JobOrderControl.Abort",
            "JobOrderControl.Resume",
        ]
    } as InstantiateObjectOptions)

    const ISA95Idx = addressSpace.getNamespaceIndex("http://opcfoundation.org/UA/ISA95-JOBCONTROL_V2/")

    const ISA95WorkMasterDataType = addressSpace?.findNode(`ns=${ISA95Idx};i=3007`) as UADataType
    const ISA95ParameterDataType = addressSpace?.findNode(`ns=${ISA95Idx};i=3003`) as UADataType

    const JobOrderControl = jobManager.getComponentByName("JobOrderControl") as UAObject
    const WorkMaster = JobOrderControl.getComponentByName("WorkMaster") as UAVariable

    const JobOrderMap = new Map<string, JobItem>()

    function storeJobOrder(JobOrder: ISA95JobOrderDataType, Comment: LocalizedText[]): ISA95_Method_ReturnCode {
        // https://reference.opcfoundation.org/ISA95JOBCONTROL/v100/docs/6.3.2
        /*
            ISA95JobOrderDataType { 
                jobOrderID: 'asdf',
                description: undefined,
                workMasterID: undefined,
                startTime: undefined,
                endTime: undefined,
                priority: undefined,
                jobOrderParameters: undefined,       
                personnelRequirements: undefined,    
                equipmentRequirements: undefined,    
                physicalAssetRequirements: undefined,
                materialRequirements: undefined      
            }
        */
        if (JobOrderMap.has(JobOrder.jobOrderID)) {
            return ISA95_Method_ReturnCode.UnableToAcceptJobOrder
        }
        JobOrderMap.set(JobOrder.jobOrderID, {
            jobOrder: JobOrder
        })
        return ISA95_Method_ReturnCode.NoError
    }

    function clearJobOrder(JobOrderId: string, Comment: LocalizedText[]): ISA95_Method_ReturnCode {
        if (JobOrderMap.has(JobOrderId) === false) {
            return ISA95_Method_ReturnCode.UnknownJobOrderId
        }
        JobOrderMap.delete(JobOrderId)
        return ISA95_Method_ReturnCode.NoError
    }

    function getJobOrderList(): ISA95JobOrderDataType[] {
        return Array.from(JobOrderMap.values()).map((item: JobItem) => { return item.jobOrder })
    }

    // JobOrderList

    const JobOrderList = JobOrderControl.getComponentByName("JobOrderList") as UAVariable
    JobOrderList.bindVariable({
        get: function(this: UAVariable): Variant {
            return new Variant({
                value: getJobOrderList(),
                dataType: DataType.ExtensionObject
            })
        },
    }, true)

    // Methods

    const StoreAndStart = JobOrderControl.getMethodByName("StoreAndStart") as UAMethod
    StoreAndStart.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method receives a new job order and stores the new job order in local storage, and start it as soon as the Job Order receiver is ready to start. After successful execution of the method, the JobOrderList shall have a new entry in state AllowedToStart. Note: the system may internally start executing the job order immediately, so potentially the job order is already in a different state when accessed the first time.
            The signature of this Method is specified below. Table 17 and Table 18 specify the Arguments and AddressSpace representation, respectively.
            StoreAndStart (
                [in]ISA95JobOrderDataType JobOrder
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            ); 
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Store = JobOrderControl.getMethodByName("Store") as UAMethod
    Store.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method receives a new job order and stores the new job order in local storage, but does not start the job order. After successful execution of the method, the JobOrderList shall have a new entry in state NotAllowedToStart.
            The signature of this Method is specified below. Table 15 and Table 16 specify the Arguments and AddressSpace representation, respectively.
            Store (
                [in]ISA95JobOrderDataType JobOrder
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            ); 
        */
        try {
            const rc = storeJobOrder(inputArguments[0].value, inputArguments[1].value)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.Good,
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
                outputArguments: [
                    new Variant({
                        value: rc,
                        dataType: DataType.UInt64
                    })
                ]
            } as CallMethodResultOptions)
        } catch (error) {
            console.log(error)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.BadInternalError
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
            } as CallMethodResultOptions)
        }
    })
    const Start = JobOrderControl.getMethodByName("Start") as UAMethod
    Start.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method starts a job order as soon as the Job Order receiver is ready to start. After successful execution of the method, job order in the JobOrderList shall be in state AllowedToStart.
            If multiple job orders have been commanded to start, then the priority and timing values in the job orders shall be used to determine the order of execution of the job orders.
            The signature of this Method is specified below. Table 19 and Table 20 specify the Arguments and AddressSpace representation, respectively.
            Start (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Update = JobOrderControl.getMethodByName("Update") as UAMethod
    Update.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method updates an existing job order that has not yet been started, with the new order information. All previously stored information is replaced.
            The signature of this Method is specified below. Table 27 and Table 28 specify the Arguments and AddressSpace representation, respectively.
            Update (
                [in]ISA95JobOrderDataType JobOrder
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Stop = JobOrderControl.getMethodByName("Stop") as UAMethod
    Stop.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method stops a started job order. After successful execution of the method, job order in the JobOrderList shall be in state Ended.
            The signature of this Method is specified below. Table 31 and Table 32 specify the Arguments and AddressSpace representation, respectively.
            Stop (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Cancel = JobOrderControl.getMethodByName("Cancel") as UAMethod
    Cancel.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method cancels a not started job order (in AllowedToStart or NotAllowedToStart) and removes the stored information. After successful execution of the method, there shall be no job order with the JobOrderID in the JobOrderList.
            The signature of this Method is specified below. Table 33 and Table 34 specify the Arguments and AddressSpace representation, respectively.
            Cancel (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Clear = JobOrderControl.getMethodByName("Clear") as UAMethod
    Clear.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method clears any maintained information on the Job Order (usually sent after a receipt of a Job Response with a status of Finished.). After successful execution of the method, there shall be no job order with the JobOrderID in the JobOrderList.
            Note: It is server-specific whether Job Orders get cleared by the Server automatically when it runs out of resources or after a period of time or other reasons.
            The signature of this Method is specified below. Table 35 and Table 36 specify the Arguments and AddressSpace representation, respectively.
            Clear (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        try {
            const rc = clearJobOrder(inputArguments[0].value, inputArguments[1].value)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.Good,
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
                outputArguments: [
                    new Variant({
                        value: rc,
                        dataType: DataType.UInt64
                    })
                ]
            } as CallMethodResultOptions)
        } catch (error) {
            console.log(error)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.BadInternalError
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
            } as CallMethodResultOptions)
        }
    })
    const RevokeStart = JobOrderControl.getMethodByName("RevokeStart") as UAMethod
    RevokeStart.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method revokes a not started job (in AllowedToStart). After successful execution of the method, job order in the JobOrderList shall be in state NotAllowedToStart.
            The signature of this Method is specified below. Table 21 and Table 22 specify the Arguments and AddressSpace representation, respectively.
            RevokeStart (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Pause = JobOrderControl.getMethodByName("Pause") as UAMethod
    Pause.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method pauses a started job. After successful execution of the method, job order in the JobOrderList shall be in state Interrupted.
            The signature of this Method is specified below. Table 23 and Table 24 specify the Arguments and AddressSpace representation, respectively.
            Pause (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Abort = JobOrderControl.getMethodByName("Abort") as UAMethod
    Abort.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method aborts a job order. After successful execution of the method, job order in the JobOrderList shall be in state Aborted.
            The signature of this Method is specified below. Table 29 and Table 30 specify the Arguments and AddressSpace representation, respectively.
            Abort (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })
    const Resume = JobOrderControl.getMethodByName("Resume") as UAMethod
    Resume.bindMethod(function (this: UAMethod, inputArguments: Variant[], context: ISessionContext, callback: CallbackT<CallMethodResultOptions>): void {
        /*
            This Method resumes an interrupted job (in state Interrupted). After successful execution of the method, job order in the JobOrderList shall be in state Running.
            The signature of this Method is specified below. Table 25 and Table 26 specify the Arguments and AddressSpace representation, respectively.
            Resume (
                [in]0:String JobOrderID
                [in]LocalizedText[] Comment
                [out]0:UInt64 ReturnStatus
            );
        */
        callback(null, {
            // statusCode?: StatusCode;
            statusCode: StatusCodes.BadNotImplemented
            // inputArgumentResults?: StatusCode[] | null;
            // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
            // outputArguments?: (VariantLike | null)[] | null;
        } as CallMethodResultOptions)
    })


    // Available WorkMasters

    const subpobj1 = addressSpace.constructExtensionObject(ISA95ParameterDataType, {
        ID: "Sub1",
        description: [
            new LocalizedText({locale: "de-DE", text: "SubParameter1"}),
        ],
        value: new Variant({value: 60.1, dataType: DataType.Double}),
        engineeringUnits: standardUnits.degree_fahrenheit,
        subparameters: []
    })

    const pobj1 = addressSpace.constructExtensionObject(ISA95ParameterDataType, {
        ID: "P1",
        description: [
            new LocalizedText({locale: "de-DE", text: "Parameter1"}),
        ],
        value: new Variant({value: 23.5, dataType: DataType.Double}),
        engineeringUnits: standardUnits.degree_celsius,
        subparameters: [
            subpobj1
        ]
    })

    const pobj2 = addressSpace.constructExtensionObject(ISA95ParameterDataType, {
        ID: "P2",
        description: [
            new LocalizedText({locale: "de-DE", text: "Parameter2"}),
        ],
        value: new Variant({value: 23.5, dataType: DataType.Double}),
        engineeringUnits: standardUnits.degree_celsius,
        subparameters: [
            subpobj1
        ]
    })

    const wmObj1 = addressSpace.constructExtensionObject(ISA95WorkMasterDataType, {
        ID: "Recipe_1",
        description: new LocalizedText({locale: "de-DE", text: "Rezept 1"}),
        parameters: [
            pobj1,
            pobj1
        ]
    })

    const wmObj2 = addressSpace.constructExtensionObject(ISA95WorkMasterDataType, {
        ID: "Recipe_2",
        description: new LocalizedText({locale: "de-DE", text: "Rezept 2"}),
        parameters: [
            pobj2,
            pobj2
        ]
    })

    WorkMaster.setValueFromSource({
        value: [
            wmObj1,
            wmObj2
        ],
        dataType: DataType.ExtensionObject
    })  
}