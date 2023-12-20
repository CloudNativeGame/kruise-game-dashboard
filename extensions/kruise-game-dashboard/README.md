### What is OpenKruiseGame(OKG)?
OpenKruiseGame is a custom Kubernetes workload designed specially for game server scenarios. It simplifies the cloud-native transformation of game servers. 

Compared with the built-in workloads of Kubernetes, such as Deployment and StatefulSet, OpenKruiseGame provides common game server management features, such as hot update, in-place update, and management of specified game servers. 

In addition, OpenKruiseGame connects game servers to cloud service providers, matchmaking services, and O&M platforms. It automatically integrates features such as logging, monitoring, network, storage, elasticity, and matching by using low-code or zero-code technologies during the cloud-native transformation of game servers. With the consistent delivery standard of Kubernetes, OpenKruiseGame implements centralized management of clusters on multiple clouds and hybrid clouds. 

OpenKruiseGame is a fully open source project. It allows developers to customize workloads and build the release and O&M platforms for game servers by using custom development. OpenKruiseGame can use Kubernetes templates or call APIs to use or extend features. It can also connect to delivery systems, such as KubeVela, to implement the orchestration and full lifecycle management of game servers on a GUI.

### What is OKG Dashboard？
OKG Dashboard visually manage the objects involved in OpenKruiseGame, such as GameServerSets and GameServers based on KubeSphere.

Through the OKG Dashboard, you can view the overall statistics of the game servers in the current cluster, and the status of all GameServerSets and GameServers. 
In addition, operations such as changing the opsState of the GameServer can also be performed by this dashboard.

### Project Homepage

https://openkruise.io/kruisegame/introduction
