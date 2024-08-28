# Changelog

## Version 2.0

### Features Added:

#### Global Configuration Page
- **Project Label Configuration**: Users can define and update the project label key to organize GameServerSets and GameServers across DeployUnits, ensuring proper organization and functionality.
- **DeployUnit Management**: Allows users to add or remove Kubernetes clusters from the list of DeployUnits managed by the dashboard.

#### Project Page
- **Project List**: Displays all projects in a table format, showing key information such as project name, GameServerSet count, GameServer count, and associated DeployUnits.
- **Cross-DeployUnit Management**: Enables management of GameServerSets and GameServers across multiple DeployUnits within a single project.
- **Resource Monitoring**: Track resource allocation and usage within each project to ensure efficient resource utilization.
- **Operational Control**: Users can perform operations like scaling GameServerSets, updating container images, and rolling out new configurations within a project.

#### DeployUnits Page
- **DeployUnit Overview**: Lists all DeployUnits with details such as DeployUnit name, GameServerSet count, GameServer count, and associated projects.
- **Cross-Cluster Management**: Manage GameServerSets across multiple DeployUnits to maintain a stable and scalable deployment environment.
- **Detailed DeployUnit Management**: Access detailed overviews of specific DeployUnits for managing GameServers and GameServerSets, including scaling and configuration updates.

#### Add Resource Page
- **Resource Creation**: Create and customize new Kubernetes resources by writing or uploading YAML files directly within the dashboard.
- **Download and Deployment**: Save or deploy configured resources with a single click after writing or uploading YAML files.

#### GameServerSet Table Page
- **Comprehensive List**: View all GameServerSets within a selected project with columns displaying key information such as replica count, update strategy, and status.
- **Batch Operations**: Perform batch operations on multiple GameServerSets, including updating container images and deleting GameServerSets.
- **Item Operations**: Manage individual GameServerSets, including operations like scaling, updating configurations, and deleting GameServerSets.

#### GameServer Table Page
- **GameServer List**: View a detailed list of all GameServers within a selected project, with information on running status, resource usage, and operational status.
- **Instance-Level Control**: Manage individual GameServers with operations like restarting, updating, or deleting specific instances.
- **Batch Operations**: Perform batch operations on multiple GameServers, including deleting servers, updating container images, adjusting resource allocations and setting Updation and deletion priority.
- **Item Actions**: Execute specific actions on individual GameServers, such as deleting a GameServer or updating its container image.
