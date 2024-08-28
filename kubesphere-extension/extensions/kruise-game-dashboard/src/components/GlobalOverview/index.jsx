import React from 'react';
import {
  GlobalOverviewWrapper,
  Title,
  SectionHeader,
  SectionContent,
  List,
  CoreComponentsList,
  WhyOKGList,
  DashboardPagesList
} from './style.jsx'; // Assuming the styles are in StyledComponents.js

const GlobalOverview = () => {
  return (
    <GlobalOverviewWrapper>
      <Title>Global Overview</Title>

      <section className="intro">
        <SectionHeader>Welcome to the OKG Dashboard</SectionHeader>
        <SectionContent>
          Welcome to the OpenKruiseGame (OKG) Dashboard, your centralized hub for managing game server deployments across multiple Kubernetes clusters. OKG is designed to simplify, accelerate, and enhance the cloud-native transformation of game servers. As a sub-project of the OpenKruise initiative under the Cloud Native Computing Foundation (CNCF), OKG integrates seamlessly with Kubernetes to provide robust solutions tailored to the unique demands of game server operations.
        </SectionContent>
      </section>

      <section className="about">
        <SectionHeader>About OpenKruiseGame (OKG)</SectionHeader>
        <SectionContent>
          OpenKruiseGame is a custom Kubernetes workload optimized for game server scenarios. It extends Kubernetes capabilities to handle the specific needs of game servers, offering features such as:
        </SectionContent>
        <List>
          <li><strong>Hot Updates and Reloads:</strong> Minimize disruptions with seamless updates without recreating pods. Learn more about the <a href="https://openkruise.io/kruisegame/user-manuals/update-strategy" target="_blank" rel="noopener noreferrer">update strategy</a>.</li>
          <li><strong>Game Server Management:</strong> Specialized operations for stateful game servers, allowing control over specific game server instances.</li>
          <li><strong>Advanced Networking:</strong> Support for network configurations suitable for game servers, including fixed IPs, lossless connections, and global acceleration. Explore more about <a href="https://openkruise.io/kruisegame/user-manuals/network" target="_blank" rel="noopener noreferrer">networking</a>.</li>
          <li><strong>Comprehensive Orchestration:</strong> Simplified orchestration of complex game server architectures, integrating various server types such as gateways, game engines, and policy servers.</li>
        </List>
      </section>

      <section className="features">
        <SectionHeader>Key Features of OKG</SectionHeader>
        <List>
          <li><strong>Hot Updates and Reloads:</strong> Facilitates live updates of game server configurations and code without downtime.</li>
          <li><strong>Game Server Isolation:</strong> Manage and update game servers individually, ensuring that active players are not affected during maintenance.</li>
          <li><strong>Flexible Networking:</strong> Choose from multiple network models designed for gaming, ensuring high performance and low latency.</li>
          <li><strong>Automated Scaling and Management:</strong> Automatically scale game servers based on demand and maintain service quality with built-in automation. Learn more about <a href="https://openkruise.io/kruisegame/user-manuals/gameservers-scale" target="_blank" rel="noopener noreferrer">scaling up and down</a>.</li>
          <li><strong>Multi-Cloud Support:</strong> Deploy and manage game servers across different cloud providers with consistency and ease.</li>
          <li><strong>Zero-Code Integration:</strong> Leverage low-code or no-code solutions to integrate essential features like logging, monitoring, and matchmaking.</li>
        </List>
      </section>

      <section className="core-components">
        <SectionHeader>Core Components of the OKG Dashboard</SectionHeader>
        <SectionContent>
          The OKG Dashboard includes several core components to streamline game server management:
        </SectionContent>
        <CoreComponentsList>
          <li><strong>DeployUnits:</strong> Kubernetes clusters designated for deploying GameServers. Configure and manage clusters to streamline game server deployments.</li>
          <li><strong>Projects:</strong> Organize your game server deployments into projects. Each project encompasses multiple GameServerSets, making it easier to manage and monitor your game server fleet.</li>
          <li><strong>GameServerSets:</strong> Define and manage groups of game servers within projects. Each set can be deployed across various DeployUnits. Learn more about <a href="https://openkruise.io/kruisegame/user-manuals/deploy-gameservers" target="_blank" rel="noopener noreferrer">deploying GameServerSets and custom resources</a>.</li>
          <li><strong>GameServers:</strong> Individual instances of game servers running within your clusters. Manage their configurations, scaling, and operations seamlessly.</li>
        </CoreComponentsList>
      </section>

      <section className="why-okg">
        <SectionHeader>Why Choose OpenKruiseGame?</SectionHeader>
        <SectionContent>
          Kubernetes provides a robust foundation for cloud-native applications, but game servers have unique needs that often go beyond standard Kubernetes features. OpenKruiseGame addresses these challenges by providing:
        </SectionContent>
        <WhyOKGList>
          <li><strong>Enhanced Game Server Management:</strong> Simplifies the lifecycle management of game servers with features specifically designed for gaming workloads.</li>
          <li><strong>Scalability and Performance:</strong> Ensures high availability and performance through advanced scaling and networking features.</li>
          <li><strong>Customizable and Extensible:</strong> Fully open-source and customizable, allowing developers to tailor workloads and integrate with various tools and platforms.</li>
        </WhyOKGList>
      </section>

      <section className="dashboard-pages">
        <SectionHeader>Overview of Dashboard Pages</SectionHeader>
        <SectionContent>
          The OKG Dashboard is designed to provide a comprehensive view and management interface for all aspects of your game server deployments. Here’s a quick overview of the key pages:
        </SectionContent>
        <DashboardPagesList>
          <li><strong>Overview Page:</strong> Provides a high-level summary of all projects, DeployUnits, GameServerSets, and GameServers. It offers quick access to essential metrics and status indicators.</li>
          <li><strong>Project Page:</strong> Displays detailed information about each game project, including a list of GameServerSets and GameServers within the project. Users can navigate to specific project details and perform actions like updating configurations and scaling servers.</li>
          <li><strong>Configuration Page:</strong> Allows users to manage global settings for the OKG Dashboard, such as project label keys and DeployUnits list. This page ensures that the dashboard is properly configured to reflect the current deployment environment.</li>
          <li><strong>DeployUnits Page:</strong> Lists all clusters designated as DeployUnits. Users can view details about each DeployUnit, including the number of GameServerSets and GameServers deployed.</li>
          <li><strong>GameServerSet Table Page:</strong> Shows all GameServerSets within a selected project. Includes functionality to filter, search, and manage GameServerSets, such as updating container images and configuring scaling policies.</li>
          <li><strong>GameServer Table Page:</strong> Lists all GameServers within a project. Users can perform various operations such as updating container configurations, restarting servers, and managing game server priorities.</li>
        </DashboardPagesList>
      </section>
    </GlobalOverviewWrapper>
  );
};

export default GlobalOverview;
