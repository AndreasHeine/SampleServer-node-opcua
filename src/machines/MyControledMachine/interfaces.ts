import { DateTime, LocalizedText, NodeId } from "node-opcua";

export interface ISA95JobOrderDataType { 
    jobOrderID: string,
    description: LocalizedText[],
    /**
     * ISA95WorkMasterDataType[]
     */
    workMasterID: any[]
    startTime: DateTime,
    endTime: DateTime,
    priority: number,
    /**
     * ISA95ParameterDataType[]
     */
    jobOrderParameters: any[]  
    /**
     * ISA95PersonnelDataType[]
     */   
    personnelRequirements: any[]
    /**
     * ISA95EquipmentDataType[]
     */  
    equipmentRequirements: any[]
    /**
     * ISA95PhysicalAssetDataType[]
     */  
    physicalAssetRequirements: any[]
    /**
     * ISA95MaterialDataType[]
     */
    materialRequirements: any[]
}

export interface JobItem {
    jobOrder: ISA95JobOrderDataType
    jobInstance?: NodeId
}