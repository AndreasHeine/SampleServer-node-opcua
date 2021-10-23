// Copyright 2021 (c) Andreas Heine
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

import chalk from 'chalk'

interface LoggerInterface {
    green(msg:String): void
    yellow(msg:String): void
    red(msg:String): void
}

class Logger implements LoggerInterface {

    constructor () {

    }

    green(msg:String): void {
        console.log(" LOG: ", chalk.green(msg))
    }

    yellow (msg:String): void {
        console.log(" LOG: ", chalk.yellow(msg))
    }

    red (msg:String): void {
        console.log(" LOG: ", chalk.red(msg))
    }
}

export const logger = new Logger()
export const green = logger.green
export const yellow = logger.yellow
export const red = logger.red