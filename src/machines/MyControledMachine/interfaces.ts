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

import { DateTime, LocalizedText } from "node-opcua";

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
