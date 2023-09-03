import { test, expect, describe } from "vitest";
import { RoleNotFound, RBAC, ActionNotFound, ResourceNotFound } from "./rbac";

describe("constructor", () => {
  test("avoid duplicated actions and resources", () => {
    const userRole = {
      id: "user",
      permissions: [
        { action: "read", resource: "users" },
        { action: "write", resource: "users" },
      ],
    };
    const rbac = new RBAC({
      resources: ["users", "users", "lessons"],
      actions: ["read", "write", "read"],
      roles: [userRole],
    });
    expect(rbac.actions).toEqual(["read", "write"]);
    expect(rbac.resources).toEqual(["users", "lessons"]);
  });

  test("avoid duplicated roles", () => {
    const userRole = {
      id: "user",
      permissions: [
        { action: "read", resource: "users" },
        { action: "write", resource: "users" },
      ],
    };
    expect(() => {
      new RBAC({
        resources: ["users", "lessons"],
        actions: ["read", "write"],
        roles: [userRole, userRole],
      });
    }).toThrowError(userRole.id);
  });

  test("failes when a role uses unexistent action", () => {
    const unregisteredAction = "delete";
    const userRole = {
      id: "user",
      permissions: [
        { action: "read", resource: "users" },
        { action: "write", resource: "users" },
        { action: unregisteredAction, resource: "users" },
      ],
    };
    expect(() => {
      new RBAC({
        resources: ["users", "lessons"],
        actions: ["read", "write"],
        roles: [userRole],
      });
    }).toThrowError(ActionNotFound);
  });

  test("failes when a role uses unexistent role", () => {
    const unregisteredResource = "lessons";
    const userRole = {
      id: "user",
      permissions: [
        { action: "read", resource: "users" },
        { action: "write", resource: unregisteredResource },
      ],
    };
    expect(() => {
      new RBAC({
        resources: ["users"],
        actions: ["read", "write"],
        roles: [userRole],
      });
    }).toThrowError(ResourceNotFound);
  });
});

describe("can", () => {
  test("failes when the role does not exist", () => {
    const rbac = new RBAC({
      resources: ["users"],
      actions: ["read"],
      roles: [],
    });
    expect(() => {
      rbac.can("user", "read", "users");
    }).toThrowError(RoleNotFound);
  });

  test("failes when the action does not exist", () => {
    const userRole = {
      id: "user",
      permissions: [{ action: "read", resource: "users" }],
    };
    const rbac = new RBAC({
      resources: ["users"],
      actions: ["read"],
      roles: [userRole],
    });
    expect(() => {
      rbac.can("user", "write", "users");
    }).toThrowError(ActionNotFound);
  });

  test("failes when the resource does not exist", () => {
    const userRole = {
      id: "user",
      permissions: [{ action: "read", resource: "users" }],
    };
    const rbac = new RBAC({
      resources: ["users"],
      actions: ["read"],
      roles: [userRole],
    });
    expect(() => {
      rbac.can("user", "read", "lessons");
    }).toThrowError(ResourceNotFound);
  });

  test("return false when the role does not have the permission", () => {
    const userRole = {
      id: "user",
      permissions: [{ action: "read", resource: "users" }],
    };
    const rbac = new RBAC({
      resources: ["users"],
      actions: ["read", "write"],
      roles: [userRole],
    });
    expect(rbac.can("user", "write", "users")).toBe(false);
  });

  test("return true when the role has the permission", () => {
    const userRole = {
      id: "user",
      permissions: [{ action: "read", resource: "users" }],
    };
    const rbac = new RBAC({
      resources: ["users"],
      actions: ["read"],
      roles: [userRole],
    });
    expect(rbac.can("user", "read", "users")).toBe(true);
  });
});
