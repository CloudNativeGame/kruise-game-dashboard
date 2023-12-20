### 什么是OpenKruiseGame(OKG)?
OpenKruiseGame（OKG）是简化游戏服云原生化的自定义Kubernetes工作负载，相比Kubernetes内置的无状态（Deployment）、有状态（StatefulSet）等工作负载而言，OpenKruiseGame（OKG）提供了热更新、原地升级、定向管理等常用的游戏服管理功能，是完全面向游戏服场景而设计的Kubernetes工作负载。

除此之外，OpenKruiseGame（OKG）还承担了游戏服与云服务、匹配服务、运维平台对接的角色，通过低代码或者0代码的方式实现游戏服云原生化时日志、监控、网络、存储、弹性、匹配等功能的自动化集成，通过Kubernetes的一致性交付标准，实现多云/混合云/多集群的统一管理。

OpenKruiseGame（OKG）是一个完全开源的项目，开发者可以通过二次开发的方式定制属于自己的游戏服工作负载，构建游戏服的发布运维后台等。除了通过Kubernetes的模板/API的方式进行调用和扩展，OpenKruiseGame（OKG）还支持与KubeVela等交付系统进行对接，通过白屏化的方式实现游戏服的编排与全生命周期管理。

### 什么是OKG Dashboard？
OKG Dashboard基于KubeSphere可视化地管理OpenKruiseGame涉及的对象，如GameServerSet与GameServer。

通过OKG Dashboard可以查看当前集群中游戏服整体统计数据、所有游戏服部署集与游戏服的运行情况。此外，还可以定向对游戏服进行更改运维状态等操作。

### 官方文档

https://openkruise.io/kruisegame/introduction
