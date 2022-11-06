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
  PermissionType
} from 'node-opcua';

export const ServerRolePermissionGroup = Object.freeze({
  // Default -> https://reference.opcfoundation.org/v104/Core/docs/Part3/4.8.2/
  DEFAULT: [
    { 
        roleId: WellKnownRoles.Supervisor, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.WriteAttribute | 
            PermissionType.WriteRolePermissions | 
            PermissionType.WriteHistorizing | 
            PermissionType.Read | 
            PermissionType.Write | 
            PermissionType.ReadHistory | 
            PermissionType.InsertHistory | 
            PermissionType.ModifyHistory | 
            PermissionType.DeleteHistory | 
            PermissionType.ReceiveEvents | 
            PermissionType.Call 
            // PermissionType.AddReference | 
            // PermissionType.DeleteNode | 
            // PermissionType.AddNode
    },
    { 
        roleId: WellKnownRoles.SecurityAdmin, 
        permissions:
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.WriteRolePermissions | 
            PermissionType.Read | 
            PermissionType.Write | 
            PermissionType.ReadHistory | 
            PermissionType.ReceiveEvents | 
            PermissionType.Call
    },
    { 
        roleId: WellKnownRoles.Operator, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.Read | 
            PermissionType.Write | 
            PermissionType.ReadHistory | 
            PermissionType.ReceiveEvents | 
            PermissionType.Call
    },
    { 
        roleId: WellKnownRoles.Observer, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.Read | 
            PermissionType.ReadHistory | 
            PermissionType.ReceiveEvents
    },
    { 
        roleId: WellKnownRoles.Engineer, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.Read | 
            PermissionType.Write | 
            PermissionType.ReadHistory | 
            PermissionType.ReceiveEvents | 
            PermissionType.Call
    },
    { 
        roleId: WellKnownRoles.ConfigureAdmin, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.WriteAttribute | 
            PermissionType.WriteHistorizing | 
            PermissionType.Read | 
            PermissionType.Write | 
            PermissionType.ReadHistory | 
            PermissionType.InsertHistory | 
            PermissionType.ModifyHistory | 
            PermissionType.ReceiveEvents | 
            PermissionType.Call
    },
    { 
        roleId: WellKnownRoles.AuthenticatedUser, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.ReadRolePermissions | 
            PermissionType.Read | 
            PermissionType.ReadHistory | 
            PermissionType.ReceiveEvents
    },
    { 
        roleId: WellKnownRoles.Anonymous, 
        permissions: 
            PermissionType.Browse | 
            PermissionType.Read
    }
  ]
});
