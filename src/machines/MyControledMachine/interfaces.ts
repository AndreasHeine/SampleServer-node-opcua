import { DateTime, LocalizedText } from "node-opcua";

export interface ISA95JobOrderDataType { 
    jobOrderID: string,
    description: LocalizedText[],
    workMasterID: any[] // ISA95WorkMasterDataType[],
    startTime: DateTime,
    endTime: DateTime,
    priority: number,
    jobOrderParameters: any[] // ISA95ParameterDataType[],       
    personnelRequirements: any[] // ISA95PersonnelDataType[],    
    equipmentRequirements: any[] // ISA95EquipmentDataType[],    
    physicalAssetRequirements: any[] // ISA95PhysicalAssetDataType[],
    materialRequirements: any[] // ISA95MaterialDataType[]      
}