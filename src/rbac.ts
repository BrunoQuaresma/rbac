export type Permission = {
  action: string;
  resource: string;
};

export type Role = {
  id: string;
  permissions: Permission[];
};

export type Config = {
  actions: string[];
  resources: string[];
  roles: Role[];
};

export class RBAC {
  actions: string[] = [];
  resources: string[] = [];
  roles: Role[] = [];

  constructor({ actions, resources, roles }: Config) {
    this.actions = unique(actions);
    this.resources = unique(resources);
    this.roles = uniqueRoles(roles).map((role) =>
      validateRole(role, actions, resources)
    );
  }

  can(roleId: string, action: string, resource: string) {
    const role = this.roles.find((role) => role.id === roleId);
    if (!role) {
      throw new RoleNotFound(roleId);
    }
    const actionExists = this.actions.find((a) => a === action);
    if (!actionExists) {
      throw new ActionNotFound(action);
    }
    const resourceExists = this.resources.find((r) => r === resource);
    if (!resourceExists) {
      throw new ResourceNotFound(resource);
    }
    return role.permissions.some(
      (permission) =>
        permission.action === action && permission.resource === resource
    );
  }
}

export class RoleNotFound extends Error {
  constructor(roleId: string) {
    super(`Invalid role: ${roleId}`);
  }
}

export class ActionNotFound extends Error {
  constructor(action: string) {
    super(`Invalid action: ${action}`);
  }
}

export class ResourceNotFound extends Error {
  constructor(resource: string) {
    super(`Invalid resource: ${resource}`);
  }
}

function validateRole(role: Role, actions: string[], resources: string[]) {
  role.permissions.forEach((permission) => {
    if (!actions.includes(permission.action)) {
      throw new ActionNotFound(permission.action);
    }
    if (!resources.includes(permission.resource)) {
      throw new ResourceNotFound(permission.resource);
    }
  });
  return role;
}

function uniqueRoles(roles: Role[]) {
  const ids = roles.map((role) => role.id);
  if (unique(ids).length !== ids.length) {
    const duplicatedIds = findDuplicates(ids);
    throw new Error(`Duplicated roles: ${duplicatedIds.join(", ")}`);
  }
  return roles;
}

function findDuplicates<T>(arr: T[]) {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
