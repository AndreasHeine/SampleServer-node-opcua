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

import { 
    WellKnownRoles,
    PermissionType,
} from 'node-opcua'

export const ServerRolePermissionGroup = Object.freeze({
    // Default -> https://reference.opcfoundation.org/v104/Core/docs/Part3/4.8.2/
    DEFAULT: [
        { 
            roleId: WellKnownRoles.Supervisor, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.SecurityAdmin, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        {   // Session Required
            roleId: WellKnownRoles.Operator, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.Observer, 
            permissions: PermissionType.Read | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.Engineer, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.ConfigureAdmin, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.AuthenticatedUser, 
            permissions: PermissionType.Read | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.Anonymous, 
            permissions: PermissionType.Read | PermissionType.Browse | PermissionType.ReceiveEvents
        },
    ],
    // Only Supervisor
    RESTRICTED: [
        { 
            roleId: WellKnownRoles.Supervisor, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
    ],
    // Only Supervisor, SecurityAdmin and ConfigureAdmin
    ADMIN: [
        { 
            roleId: WellKnownRoles.Supervisor, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.SecurityAdmin, 
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
        { 
            roleId: WellKnownRoles.ConfigureAdmin,
            permissions: PermissionType.Read | PermissionType.Write | PermissionType.Browse | PermissionType.ReceiveEvents
        },
    ],
})