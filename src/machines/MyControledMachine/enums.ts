export enum ISA95_Method_ReturnCode {
    // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/B.2#_Ref58414046
    NoError = 0,
    UnknownJobOrderId = 1,
    InvalidJobOrderStatus = 3,
    UnableToAcceptJobOrder = 4,
    // Reserved = 5-31
    InvalidRequest = 32
    // Implementation-specific = 33-63
}