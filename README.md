# RBAC JS
A simple and easy RBAC library for JS.

- Serializable
- Support TypeScript

## Usage
```ts
// Initialize RBAC with the roles, resources and permissions
const userRole = {
  id: "user",
  permissions: [{ action: "read", resource: "profile" }],
};
const adminRole = {
  id: "admin",
  permissions: [{
    actions: "delete",
    resource: "users"
  }]
}
const rbac = new RBAC({
  resources: ["users"],
  actions: ["read", "delete"],
  roles: [userRole, adminRole],
});
// Load the user
const user = await db.getUserById("123")
const isPossible = rbac.can(user.role, "delete", "users")
```
