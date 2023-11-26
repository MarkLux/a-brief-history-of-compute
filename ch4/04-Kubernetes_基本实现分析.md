# 04 Kubernetes-基本实现分析

### Pod

Pod在K8S中的具体存在形式是一系列高度关联的容器的组合，这也是K8S中最小粒度的运行和调度单位。

#### Pod的结构

一个Pod内部包含多个容器，这些容器分为两大类：Init Containers和Running Containers，前者会在Pod启动时优先运行，以实现某些功能的初始化；后者则是在初始化完成后会运行的容器。

每个容器都需要有自己独立的名称，以便和其他容器进行区分（但是多个容器的镜像可以是相同的）。

#### Pause容器

前面说到，在K8S中，所有的容器之间的网络是互通的，这其实是通过共享join同一个network namespace实现的。

在K8S中，每个Pod都隐含了一个pause容器，这个pause容器内只包含一个非常精简的进程，这个进程存在的意义就是为Pod内的network（等） namespace提供一个稳定的"宿主"。

即，Pod内的所有容器都会加入Pod内pause容器的network namespace，从而实现网络的互通。pause容器会在Pod创建时就被创建出来，并在整个Pod生命周期都持续保持存活，换个角度讲，**Pod本身其实也就是一组通过pause容器联系在一起的容器**。

![img_23.png](img_23.png)

下面就是pause容器内唯一进程对应的代码，可以看出其本身并没有任何逻辑，只是起到一个逻辑性的作用（在启动后就会处于pause状态，这也是为什么称之为pause容器）

```c
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define STRINGIFY(x) #x
#define VERSION_STRING(x) STRINGIFY(x)

#ifndef VERSION
#define VERSION HEAD
#endif

static void sigdown(int signo) {
  psignal(signo, "Shutting down, got signal");
  exit(0);
}

static void sigreap(int signo) {
  while (waitpid(-1, NULL, WNOHANG) > 0)
    ;
}

int main(int argc, char **argv) {
  int i;
  for (i = 1; i < argc; ++i) {
    if (!strcasecmp(argv[i], "-v")) {
      printf("pause.c %s\n", VERSION_STRING(VERSION));
      return 0;
    }
  }

  // 必须作为容器内的1号进程，否则不能稳定提供namesapce
  if (getpid() != 1)
    /* Not an error because pause sees use outside of infra containers. */
    fprintf(stderr, "Warning: pause should be the first process\n");

  if (sigaction(SIGINT, &(struct sigaction){.sa_handler = sigdown}, NULL) < 0)
    return 1;
  if (sigaction(SIGTERM, &(struct sigaction){.sa_handler = sigdown}, NULL) < 0)
    return 2;
  if (sigaction(SIGCHLD, &(struct sigaction){.sa_handler = sigreap,
                                             .sa_flags = SA_NOCLDSTOP},
                NULL) < 0)
    return 3;

  for (;;)
    pause(); // 持续在pause状态
  fprintf(stderr, "Error: infinite loop terminated\n");
  return 42;
}
```

> pause容器也可以为Pod内的其他容器提供除了network namespace以外的namespace共享（如PID），不过默认情况下是关闭的（会破坏容器的隔离性）

#### 生命周期

一个Pod从创建到被销毁，完整的生命周期包含以下几个阶段：

- Create：创建阶段，该阶段会首先停止pause容器和所有不该运行的容器（如果是重启），然后按顺序分别启动Pod的pasue容器、init容器和常规容器。
- Probe：健康检查阶段，如果Pod设置了livenessProbe和readinessProbe探针，那么此时会由ProbeManager创建一个worker（Go Routine）来负责该Pod后续的健康检查，这个worker此后将会一直定期检查和更新该Pod的存活状态。
- Running：正常的运行阶段，Pod内所有的容器都处于Running状态
- Shutdown：停止阶段，在Pod被销毁或停止（重启）时触发，如果Pod设置了PostStop钩子，此时会被调用。
- Restart：重启阶段，即重新回到Create阶段的过程

#### 探针与钩子

**探针**

考虑到实际运维容器时场景的多样性，K8S不太可能用一个统一的标准去界定Pod内的某一个容器是否达到可用状态，因此便引入了探针（Probe）的概念：

探针可以认为是一种用于检测容器状态的开放式接口，通过给容器定义探针可以帮助K8S识别该容器的真实状态，在K8S中存在以下三种探针：

- startupProbe：启动探针，用于判断容器是否已经启动完毕（会影响后续容器的启动和Pod状态，只会检查一次）
- livenessProbe：存活探针，用于判断容器是否存活（即定期的健康检查）
- readinessProbe：就绪探针，用于判断容器是否可以对外提供服务（会影响Service服务注册）

探针支持三种不同的运行形式：

- exec：指定容器内的一个可执行程序来运行
- httpGet：通过向容器的指定端口发送HTTP GET请求来运行
- tcpSocket：通过tcpSocket与容器指定端口通信来运行

**钩子**

很多时候容器在启动时和退出前都需要执行一些特殊操作来保证正常运行和安全，比如初始化日志文件、关闭数据库连接等，这就需要K8S能够向容器同步和同志当前容器所处的状态，为此K8S引入了钩子机制。

目前可以为容器设定两种不同的钩子：

- postStart：在容器被创建后和startupProbe探针执行前运行，需要注意的是，在一个容器的postStart钩子正确返回之前，K8S都不会启动下一个容器（根据声明顺序）
- preStop：在容器被终止前运行，只要preStop钩子没有执行完毕，容器就不会被终止

可以看出钩子程序的执行都是阻塞式的，并且需要注意的是如果钩子程序运行失败，整个容器都会直接异常退出，因此钩子函数的设定要尽可能轻量。

> 钩子程序同样可以用exec、httpGet和tcpSocket三种模式声明和运行

### Service

Pod在K8S中是被自动运维管理的，其IP就是可变且易变的，因此不能以传统物理机部署的思路，期望以某个固定的IP访问到Pod所提供的服务。

为了能够让集群内部不同的Pod（即业务模块）之间能够互相调用，就需要提供服务发现和负载均衡的能力，这就是Service对象的作用。

#### 分类：NodePort和LoadBalancer

Service对象有两种运行模式：

- NodePort - 和集群上的某个端口进行映射绑定，后续该端口的所有流量都会被转发给Service对象处理（对集群中的每个Node都生效）
- LoadBalancer - 新建一个LoadBalancer节点并与之绑定，后续所有通过该节点的流量都会被转发给Service对象，LoadBalancer的具体实现则和云厂商强相关。

下面我们主要通过NodePort模式讨论Service的实现原理，在此之前还需要了解一些基础概念：

#### Endpoint

Endpoint是K8S的一个内置对象，其作用是维护一组Pod在集群内的IP地址，存储于Master节点的etcd中。

Endpoint在Service创建时被同步创建，并存储满足该Service对象中selector规则的所有Pod的IP：

![img_24.png](img_24.png)

由于Pod的IP不是固定的，Pod本身的生命周期也是不固定的，因此EndPoint是一个动态的对象（起到了类似RPC服务中注册中心的作用）。

借助Endpoint对象，Service就可以知道此时所有可用的Pod对象的IP，并进行流量的负载均衡和转发。

#### kube-proxy

之前说过，在K8S的每个节点上都有一个kube-proxy组建，这个组件用于维护节点上的网络代理和路由规则，Service对象将流量转发给具体的Pod就是借助kube-proxy来实现的。

kube-proxy本身的实现非常复杂，这里我们主要说一下Service是如何借助kube-proxy实现流量转发的，有三种模式：

**userspace（用户空间）**

在此模式下，每当一个Service被创建，节点上的kube-proxy就会在该节点上同步创建一个iptables路由规则和一个go routine，其中iptables规则用于将服务的流量转发给kube-proxy进程， 
go routine则用于在kube-proxy和对应Pod之间搬运数据：

![img_25.png](img_25.png)

由于该模式下数据的传输依靠一个个运行在用户态的go routine，所以被称为用户空间模式。

**iptables**

在此模式下，节点上的数据转发完全依靠iptables规则，kube-proxy通过监听Endpoint和Service对象的变更，不停地动态建立/删除Pod和具体端口之间的iptables规则。

![img_26.png](img_26.png)

该模式下，所有的数据转发全部在内核态完成。

**ipvs**

在iptables模式下，如果集群中Service数量变得非常庞大时，会有非常严重的性能问题（由于iptables规则过多，路由匹配和新增规则动作都会变得异常缓慢）。
为了优化这个问题，K8S在1.9版本之后又引入了ipvs，一个同样运行在内核态的流量转发程序，但和iptables不同的是，它使用了哈希表作为底层数据结构，大大增加了匹配和新增规则的速度。

![img_27.png](img_27.png)

#### DNS形式的服务发现

如果要在集群内部使用Service来做服务发现，K8S提供了一种非常优雅的形式：将Service对象的访问地址写入集群网络的`resolve.conf`中，注册成一个DNS发现规则，
如此一来，如果希望访问某个Service，只需要访问一个对应的域名就可以，这使得集群内部的RPC访问变得极其自然。

例如想要在容器内访问一个集群内的Service对象所提供的HTTP服务，那么只需要编写这样的代码：

```go
req, err := http.NewRequest("GET", "http://${serviceName}?a=b", nil)
```

就可以自然访问到集群内${serviceName}对应的Service对象（的ClusterIP），并经过服务发现和负载均衡最终路由到一个提供该服务的Pod上。

#### Headless Service

常规模式下的Service自带负载均衡能力，访问时最终会被转发到一个具体的Pod上，但也存在一些场景（例如有状态应用）下并不需要负载均衡能力，而是希望能够获取Service下所有可用的Pod IP地址。

这种需求可以通过创建Headless Service来实现，这种Service对象被访问时会直接把Endpoint存储信息暴露出来（通过DNS访问时，返回所有可用的Pod IP列表），让使用方可以自行决定如何进行请求转发。

### Pod的存储

#### Volume

在K8S中，Volume可以看作是一种对Pod存储资源的抽象，Volume的具体实现可以有很多方式，比如`EmptyDir`、`ConfigMap`和`HostPath`等，
一个Pod内声明的Volume资源可以被Pod内任意的Container所共享（挂载），这也是通过共享pause容器的namespace来实现的。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: test-container
    image: busybox
    volumeMounts: # 配置该容器如何挂载使用Pod下的Volume
    - name: cache-volume
      mountPath: /cache
    - name: test-volume
      mountPath: /hostpath
    - name: config-volume
      mountPath: /data/configmap
    - name: special-volume
      mountPath: /data/secret
  volumes: # 声明Pod下的Volume资源
  - name: cache-volume
    emptyDir: {}
  - name: hostpath-volume
    hostPath:
      path: /data/hostpath
      type: Directory
  - name: config-volume
    configMap:
      name: special-config
  - name: secret-volume
    secret:
      secretName: secret-config
```

#### Persistent Volume

K8S内大多数Volume的实现都不是持久化的，会随着Pod的消失而被一并清理，如果希望Pod内的存储数据可以被持久化，就需要使用Persistent Volume（持久卷）。

Persistent Volume（简称PV）和上面所说的Volume不一样，它并不是一种依附于Pod的配置概念，而是一种独立于Pod存在的资源，我们可以通过yaml来声明创建一个PV：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  namespace: default
  name: local-pv
spec:
  capacity:
    storage: 200Mi
  accessModes:
    - ReadWriteMany # 可以并发读写
  storageClassName: standard # 实现方式为本地磁盘
```

在上面的例子中，创建了一个名为`local-pv`的本地磁盘PV存储，大小200M，访问模式支持并发读写。该PV被创建后就持有了一个稳定的200M存储空间，不论后续是否有Pod读写该PV，对应的存储空间都会被一直保留（直到该PV被删除）

在Pod中并不能直接使用PV，而是需要通过一种名为PersistentVolumeClaim（简称PVC）的对象来访问PV，下面是一个具体的PVC对象实例：

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: local-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: standard
  resources:
    requests:
      storage: 50Mi
```

可以看出，PVC本身只是对持久化存储资源使用诉求的一种抽象，并不会包含具体的PV和Pod信息。

在实际使用上，需要由Pod配置Volume时选择PVC类型，此时K8S会根据PVC中声明的容量及访问模式在集群内自动寻找合适的PV来进行绑定：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vol-pvc
  namespace: default
spec:
  volumes: # 声明了一个PVC Volume
  - name: html
    persistentVolumeClaim:
      claimName: local-pvc # 对应的PVC对象名
  containers:
  - name: myapp
    image: nginx
    volumeMounts: # 挂载到容器内
    - name: html
      mountPath: /usr/share/nginx/html/
```

上述Pod被应用到集群内部后，可以发现local-pvc被绑定到了local-pv上（因为集群里只有一个pv）

```text
$ kubectl get pvc
NAME        STATUS    VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
local-pvc   Bound     local-pv  50Mi       RWO,RWX                       24s
```

Pod、Volume、PV和PVC之间的关系可以用下图来表示：

![img_28.png](img_28.png)

### Workload

#### ReplicaSet

#### StatefulSet

### Auto Scaler

#### HPA

#### VPA