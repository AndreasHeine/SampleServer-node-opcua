import EventEmitter from "events"
import { JobState, JobStateNumber } from "./enums"
import { ISA95JobOrderDataType } from "./interfaces"

export class Job extends EventEmitter {

    state: JobState = JobState.NotAllowedToStart
    stateNumber: JobStateNumber = JobStateNumber.NotAllowedToStart
    jobOrder: ISA95JobOrderDataType

    constructor (jobOrder: ISA95JobOrderDataType) {
        super()
        this.jobOrder = jobOrder
        this.emit("changed", this.jobOrder)
    }

    update(jobOrder: ISA95JobOrderDataType): boolean {
        if (this.state === JobState.AllowedToStart || this.state === JobState.NotAllowedToStart) {
            this.jobOrder = jobOrder
            this.emit("changed", this.jobOrder)
            return true
        } else {
            return false
        }
    }

    revokeStart(): boolean {
        switch (this.state) {
            case JobState.AllowedToStart:
                this.state = JobState.NotAllowedToStart
                this.stateNumber = JobStateNumber.NotAllowedToStart
                this.emit("changed", this.jobOrder)
                return true
            default:
                return false
        }
    }

    start(): boolean {
        switch (this.state) {
            case JobState.AllowedToStart:
                this.state = JobState.Running
                this.stateNumber = JobStateNumber.Running
                this.emit("changed", this.jobOrder)
                return true
            case JobState.NotAllowedToStart:
                this.state = JobState.AllowedToStart
                this.stateNumber = JobStateNumber.AllowedToStart
                this.emit("changed", this.jobOrder)
                // TODO check startTime if possible jump into Running!
                if (true) {
                    this.state = JobState.Running
                    this.stateNumber = JobStateNumber.Running
                    this.emit("changed", this.jobOrder)
                }
                return true
            default:
                return false
        }
    }

    stop(): boolean {
        switch (this.state) {
            case JobState.Running:
                this.state = JobState.Ended
                this.stateNumber = JobStateNumber.Ended
                this.emit("changed", this.jobOrder)
                return true
            case JobState.Interrupted:
                this.state = JobState.Ended
                this.stateNumber = JobStateNumber.Ended
                this.emit("changed", this.jobOrder)
                return true
            default:
                return false
        }
    }

    abort(): boolean {
        switch (this.state) {
            case JobState.AllowedToStart:
                this.state = JobState.Aborted
                this.stateNumber = JobStateNumber.Aborted
                this.emit("changed", this.jobOrder)
                return true
            case JobState.NotAllowedToStart:
                this.state = JobState.Aborted
                this.stateNumber = JobStateNumber.Aborted
                this.emit("changed", this.jobOrder)
                return true
            case JobState.Running:
                this.state = JobState.Aborted
                this.stateNumber = JobStateNumber.Aborted
                this.emit("changed", this.jobOrder)
                return true
            case JobState.Interrupted:
                this.state = JobState.Aborted
                this.stateNumber = JobStateNumber.Aborted
                this.emit("changed", this.jobOrder)
                return true
            default:
                return false
        }
    }

    pause(): boolean {
        switch (this.state) {
            case JobState.Running:
                this.state = JobState.Interrupted
                this.stateNumber = JobStateNumber.Interrupted
                this.emit("changed", this.jobOrder)
                return true
            default:
                return false
        }
    }

    resume(): boolean {
        switch (this.state) {
            case JobState.Interrupted:
                this.state = JobState.Running
                this.stateNumber = JobStateNumber.Running
                this.emit("changed", this.jobOrder)
                return true
            default:
                return false
        }
    }

    cancel(): boolean {
        this.state = JobState.NotAllowedToStart
        this.stateNumber = JobStateNumber.NotAllowedToStart
        this.emit("changed", this.jobOrder)
        return true
    }
}