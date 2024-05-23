# kruise-game-dashboard
kruise-game-dashboard is working in progress for two popular opensource kubernetes dashboards following the directions below.
* https://rancher.github.io/dashboard/extensions/extensions-getting-started
* https://dev-guide.kubesphere.io/extension-dev-guide/zh/


## Development Guide

### Preparation: Install KubeSphere & OKG

#### Install KubeSphere 4.0

```bash
helm upgrade --install -n kubesphere-system --create-namespace ks-core https://charts.kubesphere.io/main/ks-core-0.4.0.tgz
```

The installation is successful if the following information is displayed:

```yaml
Release "ks-core" does not exist. Installing it now.

NAME: ks-core
LAST DEPLOYED: Wed Dec 20 19:59:19 2023
NAMESPACE: kubesphere-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Please wait for several seconds for KubeSphere deployment to complete.

1. Make sure KubeSphere components are running:

     kubectl get pods -n kubesphere-system

2. Then you should be able to visit the console NodePort:

     Console: http://xxx.xx.x.xx:30880

3. To login to your KubeSphere console:

     Account: admin
     Password: "P@88w0rd"
     NOTE: Please change the default password after login.

For more details, please visit https://kubesphere.io.
```

By default, the ks-console exposure method is nodeport.
If you want to change the exposure method, edit the corresponding svc after installation, such as changing it to LoadBalancer:

```bash
kubectl edit svc ks-console -n kubesphere-system
...
  type: LoadBalancer
...


kubectl edit svc ks-apiserver -n kubesphere-system
...
  type: LoadBalancer
...
```

If you run a kubernetes cluster with minikube, you can expose service by port-forward:

```bash
kubectl port-forward service/ks-console 7080:80 -n kubesphere-system
...

kubectl port-forward service/ks-apiserver 8070:80 -n kubesphere-system
...
```
And then, you can access ks-console by http://127.0.0.1:7080 ; access ks-apiserver by  http://127.0.0.1:8070

#### Install OKG

```bash 
# Firstly add openkruise charts repository if you haven't do this.
$ helm repo add openkruise https://openkruise.github.io/charts/
# [Optional]
$ helm repo update

# install kruise

$ helm install kruise openkruise/kruise --version 1.6.3
# install kruise-game
helm install kruise-game openkruise/kruise-game --version 0.8.0
```

Check OKG already installed:

```bash
kubectl get ns
NAME                   STATUS   AGE
...
kube-system            Active   43s
kruise-game-system     Active   22s
...

kubectl get po -A | grep  kruise
# All pods should be Running
```

### Development Configuration of OKG Dashboard

1. fork https://github.com/CloudNativeGame/kruise-game-dashboard & git clone {your_own_repo}

2. add local_config.yaml for your local development environment

```bash
touch kubesphere-extension/configs/local_config.yaml
```

```yaml
# contents of local_config.yaml as below

server:
  apiServer:
    url: http://46.116.166.66:80 # IP & port of ks-apiserver, you can find it by 'kubectl get svc -n kubesphere-system'
    wsUrl: ws://46.116.166.66:80 # IP & port of ks-apiserver, you can find it by 'kubectl get svc -n kubesphere-system'
```

If you run a kubernetes cluster with minikube, just fill in the port-forward ks-apiserver address, such as http://127.0.0.1:8070

3. Start OKG dashboard

```shell 
cd ./kubesphere-extension

// remove yarn.lock if necessary 
yarn install

yarn dev
```
4. open http://localhost:8000

The default user is 'admin', and the default password is 'P@88w0rd'.

When you change the codes, and then the displayed page will be also changed.