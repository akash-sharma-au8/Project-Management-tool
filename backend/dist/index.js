"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function addRolesAndPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create roles
        const newRoles = yield prisma.role.createMany({
            data: [
                { name: 'Admin' },
                { name: 'Manager' },
                { name: 'Employee' },
            ],
        });
        console.log(newRoles);
        // Create permissions
        const permissions = yield prisma.permission.createMany({
            data: [
                { name: 'Create Project', roleId: 9 }, // Admin has permission to create projects
                { name: 'Delete Project', roleId: 9 }, // Admin has permission to delete projects
                { name: 'Create Task', roleId: 9 }, // Admin has permission to create tasks
                { name: 'Delete Task', roleId: 9 }, // Admin has permission to delete tasks
                { name: 'Create Project', roleId: 10 }, // Manager has permission to create projects
                { name: 'Create Task', roleId: 10 }, // Manager has permission to create tasks
            ],
        });
        console.log(permissions);
    });
}
function addUser(username, email, password, roleName) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundRole = yield prisma.role.findUnique({
            where: {
                name: roleName,
            }
        });
        console.log(foundRole);
        if (!foundRole)
            throw new Error(`Role '${roleName}' not found.`);
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password,
                role: {
                    connect: {
                        id: foundRole.id,
                    }
                }
            }
        });
        console.log(newUser);
    });
}
// addUser("Kadambari Sharma", "kdm@gmail.com", "kdm123","Manager")
function getUserPermissions(email) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the user by email
        const user = yield prisma.user.findUnique({
            where: { email },
            include: { role: { include: { permissions: true } } }, // Include roles and associated permissions
        });
        if (!user) {
            throw new Error(`User with email ${email} not found.`);
        }
        // Check if user has a role assigned
        if (!user.role) {
            throw new Error(`User with email ${email} does not have a role assigned.`);
        }
        // Extract permissions from user's role
        const permissions = user.role.permissions;
        return permissions;
    });
}
// Usage example
getUserPermissions("akash@gmail.com")
    .then(permissions => console.log('User permissions:', permissions))
    .catch(error => console.error('Error retrieving user permissions:', error))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
