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

import EventEmitter from "events";
import { JobState, JobStateNumber } from "./enums";
import { ISA95JobOrderDataType } from "./interfaces";

export class Job extends EventEmitter {
  state: JobState = JobState.NotAllowedToStart;
  stateNumber: JobStateNumber = JobStateNumber.NotAllowedToStart;
  jobOrder: ISA95JobOrderDataType;
  startTime: Date | undefined = undefined;
  endTime: Date | undefined = undefined;

  constructor(jobOrder: ISA95JobOrderDataType) {
    super();
    this.jobOrder = jobOrder;
    this.changed();
  }

  private changed() {
    this.emit("changed", this);
  }

  getJobOrderAndState(): any {
    return {
      JobOrder: this.jobOrder,
      State: [
        {
          StateText: {
            text: this.state,
            locale: "en-En",
          },
          StateNumber: this.stateNumber,
        },
      ],
    };
  }

  update(jobOrder: ISA95JobOrderDataType): boolean {
    if (
      this.state === JobState.AllowedToStart ||
      this.state === JobState.NotAllowedToStart
    ) {
      this.jobOrder = jobOrder;
      this.changed();
      return true;
    } else {
      return false;
    }
  }

  revokeStart(): boolean {
    switch (this.state) {
      case JobState.AllowedToStart:
        this.state = JobState.NotAllowedToStart;
        this.stateNumber = JobStateNumber.NotAllowedToStart;
        this.changed();
        return true;
      default:
        return false;
    }
  }

  start(): boolean {
    switch (this.state) {
      case JobState.AllowedToStart:
        this.state = JobState.Running;
        this.stateNumber = JobStateNumber.Running;
        this.startTime = new Date();
        this.changed();
        return true;
      case JobState.NotAllowedToStart:
        this.state = JobState.AllowedToStart;
        this.stateNumber = JobStateNumber.AllowedToStart;
        this.changed();
        return true;
      default:
        return false;
    }
  }

  stop(): boolean {
    switch (this.state) {
      case JobState.Running:
        this.state = JobState.Ended;
        this.stateNumber = JobStateNumber.Ended;
        this.endTime = new Date();
        this.changed();
        return true;
      case JobState.Interrupted:
        this.state = JobState.Ended;
        this.stateNumber = JobStateNumber.Ended;
        this.endTime = new Date();
        this.changed();
        return true;
      default:
        return false;
    }
  }

  abort(): boolean {
    switch (this.state) {
      case JobState.AllowedToStart:
        this.state = JobState.Aborted;
        this.stateNumber = JobStateNumber.Aborted;
        this.changed();
        return true;
      case JobState.NotAllowedToStart:
        this.state = JobState.Aborted;
        this.stateNumber = JobStateNumber.Aborted;
        this.changed();
        return true;
      case JobState.Running:
        this.state = JobState.Aborted;
        this.stateNumber = JobStateNumber.Aborted;
        this.changed();
        return true;
      case JobState.Interrupted:
        this.state = JobState.Aborted;
        this.stateNumber = JobStateNumber.Aborted;
        this.changed();
        return true;
      default:
        return false;
    }
  }

  pause(): boolean {
    switch (this.state) {
      case JobState.Running:
        this.state = JobState.Interrupted;
        this.stateNumber = JobStateNumber.Interrupted;
        this.changed();
        return true;
      default:
        return false;
    }
  }

  resume(): boolean {
    switch (this.state) {
      case JobState.Interrupted:
        this.state = JobState.Running;
        this.stateNumber = JobStateNumber.Running;
        this.changed();
        return true;
      default:
        return false;
    }
  }

  cancel(): boolean {
    this.state = JobState.NotAllowedToStart;
    this.stateNumber = JobStateNumber.NotAllowedToStart;
    this.changed();
    return true;
  }
}
