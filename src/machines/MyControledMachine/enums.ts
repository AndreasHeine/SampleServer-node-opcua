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

export enum JobExecutionMode {
    // https://reference.opcfoundation.org/Machinery/Jobs/v100/docs/9.1
    SimulationMode = 0,
    TestMode = 1,
    ProductionMode = 2
}

export enum JobResult {
    // https://reference.opcfoundation.org/Machinery/Jobs/v100/docs/9.2
    Unknown = 0,
    Successful = 1,
    Unsuccessful = 2
}

export enum JobState {
    // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/6.2.1.2#_Ref53493741
    NotAllowedToStart = "NotAllowedToStart",
    AllowedToStart = "AllowedToStart",
    Running = "Running",
    Interrupted = "Interrupted",
    Ended = "Ended",
    Aborted = "Aborted"
}

export enum JobStateNumber {
    // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/6.2.1.2#_Ref53493741
    NotAllowedToStart = 1,
    AllowedToStart = 2,
    Running = 3,
    Interrupted = 4,
    Ended = 5,
    Aborted = 6
}