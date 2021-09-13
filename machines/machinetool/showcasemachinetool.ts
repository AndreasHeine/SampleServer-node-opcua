// Copyright 2021 (c) Andreas Heine

import { 
    coerceLocalizedText, 
    DataType,
    UAVariable,
    UAObject,
    AddressSpace,
    UAObjectType,
    UAVariableType,
    UADataType,
    NodeId,
    NodeIdType,
} from "node-opcua";

export const createShowCaseMachineTool = async (addressSpace: AddressSpace) => {

    // bind variable to a getter (external api call or js variable)
    // -> https://node-opcua.github.io/api_doc/2.32.0/interfaces/node_opcua.uavariable.html#bindvariable

    const idx = addressSpace?.getNamespaceIndex("10.80.0.84_4840_http://example.com/ShowcaseMachineTool/");
    const iaIdx = addressSpace?.getNamespaceIndex("http://opcfoundation.org/UA/IA/");
    const mtoolIdx = addressSpace?.getNamespaceIndex("http://opcfoundation.org/UA/MachineTool/");

    const activeProgramName = addressSpace?.findNode(`ns=${idx};i=55186`) as UAVariable;
    activeProgramName?.setValueFromSource({
        value: "Program_1",
        dataType: DataType.String,
    })

    const activeProgramNumberInList = addressSpace?.findNode(`ns=${idx};i=55185`) as UAVariable;
    activeProgramNumberInList?.setValueFromSource({
        value: 1,
        dataType: DataType.UInt16,
    })

    const productionActiveProgramStateCurrentState = addressSpace?.findNode(`ns=${idx};i=55188`) as UAVariable;
    productionActiveProgramStateCurrentState?.setValueFromSource({
        value: coerceLocalizedText("Running"),
        dataType: DataType.LocalizedText,
    })

    // changes CurrentState each 10000 msec from Running to Stopped
    setInterval(() => {
        const state = addressSpace?.findNode(`ns=${idx};i=55188`) as UAVariable;
        const stateNumber = addressSpace?.findNode(`ns=${idx};i=55190`) as UAVariable;
        if (state?.readValue().value.value.text === "Running") {
            state?.setValueFromSource({
                value: coerceLocalizedText("Stopped"),
                dataType: DataType.LocalizedText,
            })
            stateNumber.setValueFromSource({
                value: 2,
                dataType: DataType.UInt32,
            })
        } else {
            state?.setValueFromSource({
                value: coerceLocalizedText("Running"),
                dataType: DataType.LocalizedText,
            })
            stateNumber.setValueFromSource({
                value: 1,
                dataType: DataType.UInt32,
            })
        }
    }, 10000);

    // increments the value of freeoverride by 5 each sec
    let override = 50
    setInterval(() => {
        override += 5;
        if (override > 120) {
            override = 50
        }
        const feedOverride = addressSpace?.findNode(`ns=${idx};i=55229`) as UAVariable;
        feedOverride.setValueFromSource({
            value: override,
            dataType: DataType.Double,
        })
    }, 1000);

    const spindleOverride = addressSpace?.findNode(`ns=${idx};i=55238`) as UAVariable;
    spindleOverride?.setValueFromSource({
        value: 100,
        dataType: DataType.Double,
    })

    // writing ExtensionObject (Range)
    const spindleEURange = addressSpace?.constructExtensionObject(
        new NodeId(NodeIdType.NUMERIC, 884, 0),
        {
            low: 60.0,
            high: 100.0,
        }
    )
    const spindleOverrideRange = addressSpace?.findNode(`ns=${idx};i=55240`) as UAVariable;
    spindleOverrideRange?.setValueFromSource({
        value: spindleEURange,
        dataType: DataType.ExtensionObject,
    })

    // writing a enum
    const channel1 = addressSpace?.findNode(`ns=${idx};i=55233`) as UAVariable;
    channel1.setValueFromSource({
        value: 1,
        dataType: DataType.UInt32
    })
}
