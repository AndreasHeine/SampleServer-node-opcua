// SPDX-License-Identifier: Apache-2.0
//
// Copyright (c) 2024 Andreas Heine
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

export enum ISA95_Method_ReturnCode {
  // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/B.2#_Ref58414046
  NoError = 0,
  UnknownJobOrderId = 1,
  InvalidJobOrderStatus = 3,
  UnableToAcceptJobOrder = 4,
  // Reserved = 5-31
  InvalidRequest = 32,
  // Implementation-specific = 33-63
}

export enum JobExecutionMode {
  // https://reference.opcfoundation.org/Machinery/Jobs/v100/docs/9.1
  SimulationMode = 0,
  TestMode = 1,
  ProductionMode = 2,
}

export enum JobResult {
  // https://reference.opcfoundation.org/Machinery/Jobs/v100/docs/9.2
  Unknown = 0,
  Successful = 1,
  Unsuccessful = 2,
}

export enum JobState {
  // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/6.2.1.2#_Ref53493741
  NotAllowedToStart = "NotAllowedToStart",
  AllowedToStart = "AllowedToStart",
  Running = "Running",
  Interrupted = "Interrupted",
  Ended = "Ended",
  Aborted = "Aborted",
}

export enum JobStateNumber {
  // https://reference.opcfoundation.org/ISA95JOBCONTROL/v200/docs/6.2.1.2#_Ref53493741
  NotAllowedToStart = 1,
  AllowedToStart = 2,
  Running = 3,
  Interrupted = 4,
  Ended = 5,
  Aborted = 6,
}
