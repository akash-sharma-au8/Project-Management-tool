import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();





async function addRolesAndPermissions() {
    // Create roles
    const newRoles = await prisma.role.createMany({
      data: [
        { name: 'Admin' },
        { name: 'Manager' },
        { name: 'Employee' },
      ],
    });

    console.log(newRoles)
  
    // Create permissions
    const permissions = await prisma.permission.createMany({
      data: [
        { name: 'Create Project', roleId: 9 }, // Admin has permission to create projects
        { name: 'Delete Project', roleId: 9 }, // Admin has permission to delete projects
        { name: 'Create Task', roleId: 9 },    // Admin has permission to create tasks
        { name: 'Delete Task', roleId: 9 },    // Admin has permission to delete tasks
        { name: 'Create Project', roleId: 10 }, // Manager has permission to create projects
        { name: 'Create Task', roleId: 10 },    // Manager has permission to create tasks
      ],
    });

    console.log(permissions)
  }
  

async function addUser(username: string,email: string, password: string, roleName: string){

    const foundRole = await prisma.role.findUnique({
      where: {
        name: roleName,
      }
    });
    console.log(foundRole)

    if(!foundRole) throw new Error(`Role '${roleName}' not found.`);

    const newUser = await prisma.user.create({
        data:{
            username,
            email,
            password,
            role:{
              connect:{
                id: foundRole.id,
              }
            }
        }
    })
    console.log(newUser)
}

// addUser("Kadambari Sharma", "kdm@gmail.com", "kdm123","Manager")

async function getUserPermissions(email: string) {
  // Find the user by email
  const user = await prisma.user.findUnique({
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
}

// Usage example
getUserPermissions("akash@gmail.com")
  .then(permissions => console.log('User permissions:', permissions))
  .catch(error => console.error('Error retrieving user permissions:', error))
  .finally(async () => {
    await prisma.$disconnect();
  });

