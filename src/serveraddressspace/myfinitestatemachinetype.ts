import { 
    AddressSpace,
    UAFiniteStateMachineType,
    UAReferenceType,
    UAEventType
} from 'node-opcua'

export const createMyFiniteStateMachineType = async (addressSpace: AddressSpace): Promise<void> => {

    const namespace = addressSpace?.getOwnNamespace()

    const myFiniteStateMachine = namespace.addObjectType({
        browseName: 'MyFiniteStateMachineType',
        subtypeOf: 'FiniteStateMachineType'
    }) as UAFiniteStateMachineType

    const hasEffect = addressSpace.findNode('ns=0;i=54') as UAReferenceType
    const transitionEventType = addressSpace.findNode('ns=0;i=2311') as UAEventType
    const modellingRuleRef = addressSpace.findNode('ns=0;i=37') as UAReferenceType
    const modellingRuleMandatory = addressSpace.findNode('ns=0;i=78')

    const initState = namespace.addState(myFiniteStateMachine, 'Initializing', 100, true)
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     initState.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const idleState = namespace.addState(myFiniteStateMachine, 'Idle', 200)
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     idleState.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const prepareState = namespace.addState(myFiniteStateMachine, 'Prepare', 300)
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     prepareState.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const processingState = namespace.addState(myFiniteStateMachine, 'Processing', 400)
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     processingState.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const doneState = namespace.addState(myFiniteStateMachine, 'Done', 500)
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     doneState.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }

    const initToIdle = namespace.addTransition(myFiniteStateMachine, 'Initializing', 'Idle', 1)
    if (hasEffect != null && transitionEventType != null) {
        initToIdle.addReference({
            referenceType: hasEffect,
            nodeId: transitionEventType,
        })
    }
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     initToIdle.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const idleToPrepare = namespace.addTransition(myFiniteStateMachine, 'Idle', 'Prepare', 2)
    if (hasEffect != null && transitionEventType != null) {
        idleToPrepare.addReference({
            referenceType: hasEffect,
            nodeId: transitionEventType,
        })
    }
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     idleToPrepare.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const prepareToProcessing = namespace.addTransition(myFiniteStateMachine, 'Prepare', 'Processing', 3)
    if (hasEffect != null && transitionEventType != null) {
        prepareToProcessing.addReference({
            referenceType: hasEffect,
            nodeId: transitionEventType,
        })
    }
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     prepareToProcessing.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const processingToDone = namespace.addTransition(myFiniteStateMachine, 'Processing', 'Done', 4)
    if (hasEffect != null && transitionEventType != null) {
        processingToDone.addReference({
            referenceType: hasEffect,
            nodeId: transitionEventType,
        })
    }
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     processingToDone.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
    const doneToIdle = namespace.addTransition(myFiniteStateMachine, 'Done', 'Idle', 5)
    if (hasEffect != null && transitionEventType != null) {
        doneToIdle.addReference({
            referenceType: hasEffect,
            nodeId: transitionEventType,
        })
    }
    // if (modellingRuleRef != null && modellingRuleMandatory != null) {
    //     doneToIdle.addReference({
    //         referenceType: modellingRuleRef,
    //         nodeId: modellingRuleMandatory,
    //     })
    // }
}
