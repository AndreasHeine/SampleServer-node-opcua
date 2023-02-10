// Copyright 2023 (c) Andreas Krämer, basyskom GmbH - Germany
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
    coerceLocalizedText,
    coerceNodeId,
    DataType,
    UAVariable,
    AddressSpace,
    NodeId,
    NodeIdType,
} from 'node-opcua'

export const createWoodWorkingFullLogic = async (addressSpace: AddressSpace): Promise<void> => {

    // Define full "fl..." woodworking IDENTIFICATION nodes
    const flAssetIdNode = addressSpace?.findNode('ns=34;i=6026') as UAVariable;
    const flComponentNameNode = addressSpace?.findNode('ns=34;i=6027') as UAVariable;
    const flCustomerCompNameNode = addressSpace?.findNode('ns=34;i=6028') as UAVariable;
    const flDeviceClassNode = addressSpace?.findNode('ns=34;i=6018') as UAVariable;
    const flHardwareRevNode = addressSpace?.findNode('ns=34;i=6029') as UAVariable;
    const flInitOperDataNode = addressSpace?.findNode('ns=34;i=6030') as UAVariable;
    const flLocationNode = addressSpace?.findNode('ns=34;i=6031') as UAVariable;
    const flLocationGpsNode = addressSpace?.findNode('ns=34;i=6032') as UAVariable;
    const flLocationPlantNode = addressSpace?.findNode('ns=34;i=6033') as UAVariable;
    const flManufacturerNode = addressSpace?.findNode('ns=34;i=6019') as UAVariable;
    const flManufacturerUriNode = addressSpace?.findNode('ns=34;i=6034') as UAVariable;
    const flModelNode = addressSpace?.findNode('ns=34;i=6020') as UAVariable;
    const flProductCodeNode = addressSpace?.findNode('ns=34;i=6036') as UAVariable;
    const flProductInstanceUriNode = addressSpace?.findNode('ns=34;i=6021') as UAVariable;
    const flSerialNumberNode = addressSpace?.findNode('ns=34;i=6022') as UAVariable;
    const flSoftwareRevisionNode = addressSpace?.findNode('ns=34;i=6037') as UAVariable;
    const flYearOfConstructionNode = addressSpace?.findNode('ns=34;i=6023') as UAVariable;

    // Define full "fl..." woodworking STATE - MACHINE -FLAGS nodes
    const flAairPresentNode = addressSpace?.findNode('ns=34;i=6048') as UAVariable;
    const flAlarmNode = addressSpace?.findNode('ns=34;i=6039') as UAVariable;
    const flCalibratedNode = addressSpace?.findNode('ns=34;i=6040') as UAVariable;
    const flDustChipSuctionNode = addressSpace?.findNode('ns=34;i=6049') as UAVariable;
    const flEmergencyNode = addressSpace?.findNode('ns=34;i=6041') as UAVariable;
    const flEnergySafingNode = addressSpace?.findNode('ns=34;i=60340') as UAVariable;
    const flErrorNode = addressSpace?.findNode('ns=34;i=6042') as UAVariable;
    const flExternalEmergencyNode = addressSpace?.findNode('ns=34;i=6051') as UAVariable;
    const flFeedRunsNode = addressSpace?.findNode('ns=34;i=6052') as UAVariable;
    const flHoldNode = addressSpace?.findNode('ns=34;i=6053') as UAVariable;
    const flLoadingEnabledNode = addressSpace?.findNode('ns=34;i=6054') as UAVariable;
    const flMachineInitNode = addressSpace?.findNode('ns=34;i=6043') as UAVariable;
    const flMachineOnNode = addressSpace?.findNode('ns=34;i=6044') as UAVariable;
    const flMaintananceReqiredNode = addressSpace?.findNode('ns=34;i=6055') as UAVariable;
    const flManualActivityReqNode = addressSpace?.findNode('ns=34;i=6056') as UAVariable;
    const flMovingNode = addressSpace?.findNode('ns=34;i=6057') as UAVariable;
    const flPowerPresentNode = addressSpace?.findNode('ns=34;i=6045') as UAVariable;
    const flRecipeInHoldNode = addressSpace?.findNode('ns=34;i=6058') as UAVariable;
    const flRecipeInRunNode = addressSpace?.findNode('ns=34;i=6046') as UAVariable;
    const flRecipeInSetupNode = addressSpace?.findNode('ns=34;i=6059') as UAVariable;
    const flRemoteNode = addressSpace?.findNode('ns=34;i=6060') as UAVariable;
    const flSafetyNode = addressSpace?.findNode('ns=34;i=6061') as UAVariable;
    const flWaitLoadNode = addressSpace?.findNode('ns=34;i=6062') as UAVariable;
    const flWaitUnloadNode = addressSpace?.findNode('ns=34;i=6063') as UAVariable;
    const flWarningNode = addressSpace?.findNode('ns=34;i=6047') as UAVariable;
    const flWorkPiecePresentNode = addressSpace?.findNode('ns=34;i=6064') as UAVariable;

    // Define full "fl..." woodworking STATE - MACHINE -OVERVIEW nodes
    const flCurrentModeNode = addressSpace?.findNode('ns=34;i=6024') as UAVariable;
    const flCurrentStateNode = addressSpace?.findNode('ns=34;i=6025') as UAVariable;

    // Define full "fl..." woodworking STATE - MACHINE -VALUES nodes
    const flAbsErrorTime = addressSpace?.findNode('ns=34;i=6065') as UAVariable;
    const flAbsLength = addressSpace?.findNode('ns=34;i=6066') as UAVariable;
    const flAbsMachOffTimeNode = addressSpace?.findNode('ns=34;i=6067') as UAVariable;
    const flAbsMachOnTimeNode = addressSpace?.findNode('ns=34;i=6068') as UAVariable;
    const flAbsPiecesInNode = addressSpace?.findNode('ns=34;i=6069') as UAVariable;
    const flAbsPiecesOutNode = addressSpace?.findNode('ns=34;i=6070') as UAVariable;
    const flAbsPowerPrsntTimeNode = addressSpace?.findNode('ns=34;i=6071') as UAVariable;
    const flAbsProdTimeNode = addressSpace?.findNode('ns=34;i=6072') as UAVariable;
    const flAbsProdWaitWorkpTimeNode = addressSpace?.findNode('ns=34;i=6073') as UAVariable;
    const flAbsProdWoutWorkpTimeNode = addressSpace?.findNode('ns=34;i=6074') as UAVariable;
    const flAbsReadyTimeNode = addressSpace?.findNode('ns=34;i=6075') as UAVariable;
    const flAbsRunsAbortedNode = addressSpace?.findNode('ns=34;i=6076') as UAVariable;
    const flAbsRunsGoodNode = addressSpace?.findNode('ns=34;i=6077') as UAVariable;
    const flAbsRunsTotalNode = addressSpace?.findNode('ns=34;i=6078') as UAVariable;
    const flAbsStandbyTimeNode = addressSpace?.findNode('ns=34;i=6079') as UAVariable;
    const flAbsWorkingTimeNode = addressSpace?.findNode('ns=34;i=6080') as UAVariable;
    const flActCycleNode = addressSpace?.findNode('ns=34;i=6081') as UAVariable;
    const flAxisOverrideNode = addressSpace?.findNode('ns=34;i=6082') as UAVariable;
    const flFeedSpeedNode = addressSpace?.findNode('ns=34;i=6083') as UAVariable;
    const flRelErrorTimeNode = addressSpace?.findNode('ns=34;i=6084') as UAVariable;
    const flRelLengthNode = addressSpace?.findNode('ns=34;i=6085') as UAVariable;
    const flRelMachOnTimeNode = addressSpace?.findNode('ns=34;i=6086') as UAVariable;
    const flRelPiecesInNode = addressSpace?.findNode('ns=34;i=6087') as UAVariable;
    const flRelPiecesOutNode = addressSpace?.findNode('ns=34;i=6088') as UAVariable;
    const flRelPowerPrsntTimeNode = addressSpace?.findNode('ns=34;i=6089') as UAVariable;
    const flRelProdTimeNode = addressSpace?.findNode('ns=34;i=6090') as UAVariable;
    const flRelProdWaitWorkpTimeNode = addressSpace?.findNode('ns=34;i=6091') as UAVariable;
    const flRelProdWoutWorkpTimeNode = addressSpace?.findNode('ns=34;i=6092') as UAVariable;
    const flRelReadyTimeNode = addressSpace?.findNode('ns=34;i=6093') as UAVariable;
    const flRelRunsAbortedNode = addressSpace?.findNode('ns=34;i=6094') as UAVariable;
    const flRelRunsGoodNode = addressSpace?.findNode('ns=34;i=6095') as UAVariable;
    const flRelRunsTotalNode = addressSpace?.findNode('ns=34;i=6096') as UAVariable;
    const flRelStandbyTimeNode = addressSpace?.findNode('ns=34;i=6097') as UAVariable;
    const flRelWorkingTimeNode = addressSpace?.findNode('ns=34;i=6098') as UAVariable;
    const flSpindleOverrideNode = addressSpace?.findNode('ns=34;i=6099') as UAVariable;


    // Set full woodworking IDENTIFICATION nodes
    flAssetIdNode?.setValueFromSource({ dataType: DataType.String, value: "12" });
    flDeviceClassNode?.setValueFromSource({ dataType: DataType.String, value: "Class A12" });
    flHardwareRevNode?.setValueFromSource({ dataType: DataType.String, value: "V. 4.6" });
    //initOperDataNode?.setValueFromSource(    {dataType: DataType.DateTime, value: Date.now});
    flLocationNode?.setValueFromSource({ dataType: DataType.String, value: "Darmstadt" });
    flLocationGpsNode?.setValueFromSource({ dataType: DataType.String, value: "S33°51'25.07\", E151°12'54.57\"" });
    flLocationPlantNode?.setValueFromSource({ dataType: DataType.String, value: "Darmstadt" });
    flLocationPlantNode?.setValueFromSource({ dataType: DataType.String, value: "Darmstadt" });
    flManufacturerUriNode?.setValueFromSource({ dataType: DataType.String, value: "https://www.basyskom.com" });
    flProductCodeNode?.setValueFromSource({ dataType: DataType.String, value: "WW0636C48H3261" });
    flProductInstanceUriNode?.setValueFromSource({ dataType: DataType.String, value: "https://www.example.com" });
    flSerialNumberNode?.setValueFromSource({ dataType: DataType.String, value: "378485745354392" });
    flSoftwareRevisionNode?.setValueFromSource({ dataType: DataType.String, value: "2.6.23" });
    flYearOfConstructionNode?.setValueFromSource({ dataType: DataType.UInt16, value: "2023" });


    // Intervall to change opc ua node-values 
    var intervallID = setInterval(function () {
        setBasicWwValues();
    }, 2500);

    // Set the identification values for basic woodworking companion specification
    function setBasicWwValues() {
        let rndmMin = 10;
        let rndmMax = 500;
        let rndm = getRandomArbitrary(rndmMin, rndmMax);
        let rndm1 = getRandomArbitrary(rndmMin, rndmMax);
        let rndm2 = getRandomArbitrary(rndmMin, rndmMax);
        let rndm3 = getRandomArbitrary(rndmMin, rndmMax);
        let rndm4 = getRandomArbitrary(rndmMin, rndmMax);
        let rndm5 = getRandomArbitrary(rndmMin, rndmMax);

        // Set full woodworking STATE - MACHINE -FLAGS nodes
        flAairPresentNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 100 ? false : true) });
        flAlarmNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 450 ? false : true) });
        flCalibratedNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 310 ? false : true) });
        flDustChipSuctionNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 200 ? false : true) });
        flEmergencyNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 180 ? false : true) });
        flEnergySafingNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 310 ? false : true) });
        flErrorNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 120 ? false : true) });
        flExternalEmergencyNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 80 ? false : true) });
        flFeedRunsNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 415 ? false : true) });
        flHoldNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 80 ? false : true) });
        flLoadingEnabledNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 190 ? false : true) });
        flMachineInitNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 470 ? false : true) });
        flMachineOnNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 345 ? false : true) });
        flMaintananceReqiredNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 66 ? false : true) });
        flManualActivityReqNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 385 ? false : true) });
        flMovingNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 99 ? false : true) });
        flPowerPresentNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 269 ? false : true) });
        flRecipeInHoldNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 145 ? false : true) });
        flRecipeInRunNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 488 ? false : true) });
        flRecipeInSetupNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 372 ? false : true) });
        flRemoteNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 33 ? false : true) });
        flSafetyNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 172 ? false : true) });
        flWaitLoadNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 410 ? false : true) });
        flWaitUnloadNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 255 ? false : true) });
        flWarningNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 450 ? false : true) });
        flWorkPiecePresentNode?.setValueFromSource({ dataType: DataType.Boolean, value: (rndm < 200 ? false : true) });

        // Set full woodworking STATE - MACHINE - OVERVIEW nodes
        flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 1 });
        flCurrentStateNode?.setValueFromSource({ dataType: DataType.Int32, value: 2 });

        // Set current mode STATE - MACHINE - OVERWIEW
        switch (true) {
            case (rndm > 0 && rndm < 100):
                flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 1 });
                flCurrentStateNode?.setValueFromSource({ dataType: DataType.Int32, value: 4 });
                break;
            case (rndm > 100 && rndm < 200):
                flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 2 });
                flCurrentStateNode?.setValueFromSource({ dataType: DataType.Int32, value: 3 });
                break;
            case (rndm > 200 && rndm < 300):
                flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 3 });
                flCurrentStateNode?.setValueFromSource({ dataType: DataType.Int32, value: 2 });
                break;
            case (rndm > 300 && rndm < 400):
                flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 4 });
                flCurrentStateNode?.setValueFromSource({ dataType: DataType.Int32, value: 1 });
                break;
            case (rndm > 400 && rndm < 500):
                flCurrentModeNode?.setValueFromSource({ dataType: DataType.Int32, value: 5 });
                break;
            default:
                break;

        }

        // Set woodworking STATE - MACHINE -OVERVIEW node
        flAbsErrorTime?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flAbsLength?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flAbsMachOffTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flAbsMachOnTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flAbsPiecesInNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flAbsPiecesOutNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flAbsPowerPrsntTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flAbsProdTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flAbsProdWoutWorkpTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flAbsProdWaitWorkpTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flAbsReadyTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flAbsRunsAbortedNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flAbsRunsGoodNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flAbsRunsTotalNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flAbsStandbyTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flAbsWorkingTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flActCycleNode?.setValueFromSource({ dataType: DataType.Double, value: rndm2 });
        flAxisOverrideNode?.setValueFromSource({ dataType: DataType.UInt32, value: rndm3 });
        flFeedSpeedNode?.setValueFromSource({ dataType: DataType.Double, value: rndm4 });
        flRelErrorTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flRelLengthNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flRelMachOnTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flRelPiecesInNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flRelPiecesOutNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flRelPowerPrsntTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flRelProdTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flRelProdWaitWorkpTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flRelProdWoutWorkpTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flRelReadyTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flRelRunsAbortedNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm5 });
        flRelRunsGoodNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm1 });
        flRelRunsTotalNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm2 });
        flRelStandbyTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm3 });
        flRelWorkingTimeNode?.setValueFromSource({ dataType: DataType.UInt64, value: rndm4 });
        flSpindleOverrideNode?.setValueFromSource({ dataType: DataType.UInt32, value: rndm5 });
    }

    //Returns an randomized value between given range
    function getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
