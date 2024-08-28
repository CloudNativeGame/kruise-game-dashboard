# OpenKruise Dashboard 2.0 Documentation

## Introduction

### Overview
The OpenKruise Dashboard 2.0 is a sophisticated web-based interface designed to manage game server deployments across Kubernetes clusters. This dashboard serves as a comprehensive management tool, providing users with the ability to monitor, configure, and control various aspects of game server infrastructure, tailored specifically for game deployment scenarios.

### Purpose
The purpose of the OpenKruise Dashboard 2.0 is to simplify the deployment and management of game servers on Kubernetes clusters, offering a visual and intuitive interface for performing complex operations. The dashboard integrates advanced features that cater to the specific needs of game server management, such as hot updates, server isolation, and automated scaling.

For a detailed overview, refer to [OpenKruise Introduction](https://openkruise.io/kruisegame/introduction/).

## Core Concepts

### DeployUnit
- **Definition**: A DeployUnit represents a Kubernetes cluster or a group of clusters where game servers are deployed. Each DeployUnit is a managed environment where GameServerSets and GameServers are created and maintained.
- **Features**:
  - **Cluster Management**: View and manage multiple Kubernetes clusters designated as DeployUnits.
  - **Resource Allocation**: Monitor and allocate resources like CPU and memory to ensure optimal performance of game servers within each DeployUnit.
  - **Deployment Control**: Manage the lifecycle of game server deployments within each DeployUnit.

### Project
- **Definition**: A Project in the OKG Dashboard is a logical grouping of GameServerSets, representing a complete game or a specific part of a game that needs isolated management.
- **Features**:
  - **Organized Management**: Group GameServerSets and GameServers logically to manage them as part of a single game project.
  - **Isolation**: Projects provide isolation for different parts of a game or different games altogether, allowing focused management.
  - **Resource Monitoring**: Track resource usage across all GameServerSets within a project, ensuring balanced and efficient use.

### GameServerSet
- **Definition**: A GameServerSet is a collection of game servers that share the same configuration and are deployed as a unit. It defines the desired number of replicas, update strategies, and specific configurations for game servers.
- **Features**:
  - **Replica Management**: Define and adjust the number of game server replicas to meet the demand.
  - **Rolling Updates**: Apply rolling updates to GameServers with minimal disruption, supporting strategies like in-place updates.
  - **Template Configuration**: Set up a template for GameServers, including container images, resource limits, and other settings.

### GameServer
- **Definition**: A GameServer is an individual server instance within a GameServerSet, representing a single instance of the game running on a Kubernetes pod.
- **Features**:
  - **Instance Control**: Start, stop, and restart individual GameServers as needed.
  - **Health Monitoring**: Monitor the health and status of each GameServer to ensure optimal performance.
  - **Dynamic Configuration**: Modify settings and configurations of individual GameServers on the fly, adapting to changing conditions.

For information on deploying game servers, refer to [Deploying GameServers](https://openkruise.io/kruisegame/user-manuals/deploy-gameservers).

## Dashboard Overview

### Global Configuration Page
- **Purpose**: The Global Configuration page allows users to set up and manage the global settings that affect the entire OKG Dashboard. This includes defining project labels, configuring DeployUnits, and setting global policies.
- **Features**:
  - **Project Label Key**: Define the label key used to identify which project a GameServerSet and Gameserver belongs to. This is crucial for organizing GameServerSets and GameServers across DeployUnits.
    - **Note**: Ensure that the project label key defined here matches the label key used when deploying GameServerSets. The project name in the GameServerSet YAML file should align with the configuration in the Global Configuration to ensure proper organization and functionality.

    **Example YAML for GameServerSet**:

      ```yaml
        apiVersion: game.kruise.io/v1alpha1
        kind: GameServerSet
        metadata:
          labels:
            # The GameServerSets that have this label can be recognized by the Dashboard.
            project-name: project-new
          name: game-new
          namespace: default
        spec:
          replicas: 5
          updateStrategy:
            rollingUpdate:
              podUpdatePolicy: InPlaceIfPossible
          gameServerTemplate:
            reclaimPolicy: Delete
            metadata:
              labels:
                # The GameServers that have this label can be recognized by the Dashboard.
                project-name: project-new
            spec:
              containers:
                - image: registry.cn-hangzhou.aliyuncs.com/acs/minecraft-demo:1.12.2
                  name: minecraft



  - **DeployUnits Configuration**: Manage the list of DeployUnits by specifying the clusters to be treated as DeployUnits within the dashboard.
- **User Operations**:
  - **Label Configuration**: Set and update the project label key to ensure proper organization of GameServerSets and GameServers.
  - **DeployUnit Management**: Add or remove clusters from the DeployUnits list to control where GameServerSets are deployed.

![image](https://github.com/user-attachments/assets/a97e891e-56a2-476a-8cb5-06ed4ab858fb)




### Project Page
- **Purpose**: The Project Page within the OKG Dashboard serves as the central hub for organizing and managing the deployment of game servers across different logical groupings, referred to as projects. This page is designed to give users an in-depth view of all projects, allowing for efficient management and monitoring of resources across multiple DeployUnits.
- **Features**:
  - **Project List**:
    - The Project Page displays all projects in a table format, where each row or card represents a project. Key information provided for each project includes:
      - **Project Name**: The identifier for the project.
      - **GameServerSet Count**: The number of GameServerSets associated with the project.
      - **GameServer Count**: The total number of GameServers running within the project.
      - **DeployUnits**: An array that lists the DeployUnits (Kubernetes clusters) where the project is deployed.
  - **Cross-DeployUnit Management**: The Project Page enables users to manage GameServerSets and GameServers across multiple DeployUnits within a single project. This feature ensures that resources are consistently managed and deployed according to the project’s needs, regardless of the underlying infrastructure.
- **User Operations**:
  - **Project Navigation**: Users can select any project from the list to view a detailed overview of its GameServerSets and GameServers. This detailed view allows users to drill down into specific aspects of the project, gaining a comprehensive understanding of its deployment status.
  - **Resource Monitoring**: The Project Page allows users to monitor resource allocation and usage within each project. This ensures that the project is utilizing cluster resources efficiently, preventing over-allocation or resource starvation.
  - **Operational Control**: Users have the ability to perform various operations on GameServerSets and GameServers within a project, including:
    - **Scaling GameServerSets**: Adjust the number of replicas to match the current demand.
    - **Updating Container Images**: Roll out new container images across the project to deploy updated game server versions.
    - **Rolling Out New Configurations**: Implement new configurations or update existing ones to optimize performance.
    - **Batch and Item Actions**: Users can perform bulk operations, such as updating resources, deleting GameServers or GameServerSets, updating network policies, and modifying replicas.

![image](https://github.com/user-attachments/assets/d2cf5b61-b96e-4f66-ab26-d4939b688187)



### DeployUnits Page
- **Purpose**: The DeployUnits page serves as a centralized interface for viewing and managing all DeployUnits (Kubernetes clusters) within the OKG Dashboard. It provides a comprehensive overview of the deployment environment, enabling users to monitor the health and performance of their clusters and efficiently manage game server deployments across multiple DeployUnits.
- **Features**:
  - **DeployUnit Overview**:
    - The page lists all DeployUnits managed within the OKG Dashboard, providing detailed information such as:
      - **DeployUnit Name**: The identifier for each Kubernetes cluster.
      - **GameServerSet Count**: The total number of GameServerSets deployed within the DeployUnit.
      - **GameServer Count**: The total number of GameServers running in the DeployUnit.
      - **Projects**: An array representing the projects associated with each DeployUnit.
  - **Cross-Cluster Management**: The page allows users to manage GameServerSets across multiple DeployUnits, ensuring consistency and availability of game servers. This feature is essential for maintaining a stable and scalable deployment environment.
- **User Operations**:
  - **Detailed DeployUnit Management**: By clicking on any DeployUnit, users can access a detailed overview of that specific cluster. This detailed view allows users to manage GameServers and GameServerSets within the selected DeployUnit, performing operations such as scaling, updating configurations, or troubleshooting issues.
  - **DeployUnit Configuration**: Users have the ability to add or remove DeployUnits from the OKG Dashboard’s management. This control allows users to define where game servers are deployed, enabling more precise management of their deployment environment.

![image](https://github.com/user-attachments/assets/2417ece2-2018-480e-9a00-8780256a5ca6)


### Add Resource Page
- **Purpose**: The Add Resource Page is designed to streamline the process of adding new Kubernetes resources within the OKG Dashboard. This page allows users to create and deploy resources like GameServerSets, GameServers, StatefulSets, or DaemonSets by either uploading an existing YAML file or creating a new one directly within the dashboard.
- **User Operations**:
  - **Resource Creation**:
    - Users can create new resources by either writing a YAML file in the built-in editor or uploading an existing YAML file from their system. This flexibility allows for:
      - **Direct Input**: Manually create and customize resources from scratch within the dashboard.
      - **File Upload**: Upload YAML files created externally, providing an easy way to integrate existing configurations.
  - **Download and Deployment**:
    - After writing or uploading a YAML file, users can:
      - **Download**: Save the YAML file to their system for backup or later use.
      - **Deploy**: Deploy the configured resource directly through the dashboard with a single click, making the process seamless and efficient.


![image](https://github.com/user-attachments/assets/9cdf030a-0ae4-4395-8990-f586b478c08c)

### Pages of Project

#### GameServerSet Table Page

**Purpose**: The GameServerSet Table Page provides a detailed view of all GameServerSets within a selected project. This page is designed for managing and monitoring the deployment of game servers at a granular level.

**Features**:
- **Comprehensive List**: View all GameServerSets within the selected project, with columns displaying key information such as replica count, update strategy, status, labels, etc.
- **Search and Filtering**: Use search and filtering tools to quickly locate specific GameServerSets based on criteria like name.
- **Batch Operations**: Perform batch operations on multiple GameServerSets, like updating container images and deleting multiple GameServerSets.
- **Item Operations**: Perform item operations on individual GameServerSets, like deleting a GameServerSet, updating container images, and updating replica count.

**User Operations**:
- **GameServerSet Management**: Select individual GameServerSets for detailed management, including scaling, updating, and rolling out new configurations.
- **Batch Operations**: Execute batch operations across multiple GameServerSets to streamline updates and scaling.
- **Search and Filter**: Use advanced search and filter options to quickly find and manage specific GameServerSets.

![image](https://github.com/user-attachments/assets/39cf1690-e4c0-471c-9aca-163ae3aa5b12)


#### GameServer Table Page

**Purpose**: The GameServer Table Page lists all individual GameServers within a selected project. This page allows for detailed management and monitoring of each GameServer instance.

**Features**:
- **GameServer List**: View a list of all GameServers within the selected context, with detailed information such as running status, resource usage, and operational status.
- **Health and Status Monitoring**: Monitor the health and status of each GameServer.
- **Instance-Level Control**: Manage each GameServer individually, with operations like restarting, updating, or deleting specific instances.

**User Operations**:
- **GameServer Management**: Perform detailed management of individual GameServers, including deleting servers, updating container images, updating network policies, and adjusting resource allocations.
- **Monitoring and Troubleshooting**: Monitor the health of each GameServer and troubleshoot issues at the instance level.
- **Search and Filter**: Use advanced search and filter options to quickly find and manage specific GameServerSets.

**Batch Operations**:
- **Users can perform batch operations on multiple GameServers simultaneously**, including:
  - **Deleting GameServers**: Remove multiple GameServers in one action to streamline cleanup processes.
  - **Updating Container Images**: Apply new container images to multiple GameServers at once.
  - **Updating Operational State (opsState)**: Change the operational state of multiple GameServers to adjust their behavior or maintenance status.
  - **Updating Resources**: Modify CPU and memory resources for multiple GameServers, with the option to:
    - **Recreate Pods**: Select a checkbox to recreate pods with the updated configuration, ensuring that changes take effect.

**Item Actions**:
- For individual GameServers, users can:
  - **Delete Specific GameServer**: Remove a single GameServer that is no longer required or is problematic.
  - **Update Image**: Change the container image of a specific GameServer, applying new configurations or versions.

![image](https://github.com/user-attachments/assets/66b2adf8-8f2b-4645-a501-c6e251a47d5b)


For detailed usage instructions, refer to [OKG Dashboard User Guide](https://openkruise.io/kruisegame/user-manuals).


