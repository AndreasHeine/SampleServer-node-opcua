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

    const JobOrderMap = new Map<string, Variant>()

    function storeJobOrder(JobOrder: any, Comment: any) {
        // https://reference.opcfoundation.org/ISA95JOBCONTROL/v100/docs/6.3.2
        console.log(`storeJobOrder:`, JobOrder, Comment)
        JobOrderMap.set(JobOrder.jobOrderID, JobOrder)
    }

    function clearJobOrder(JobOrderId: any, Comment: LocalizedText) {
        console.log(`clearJobOrder:`, JobOrderId, Comment)
        JobOrderMap.delete(JobOrderId)
    }

    function getJobOrderList() {
        return Array.from(JobOrderMap.values())
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
        try {
            storeJobOrder(inputArguments[0].value, inputArguments[1].value)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.Good
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
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
        try {
            clearJobOrder(inputArguments[0].value, inputArguments[1].value)
            callback(null, {
                // statusCode?: StatusCode;
                statusCode: StatusCodes.Good
                // inputArgumentResults?: StatusCode[] | null;
                // inputArgumentDiagnosticInfos?: (DiagnosticInfo | null)[] | null;
                // outputArguments?: (VariantLike | null)[] | null;
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