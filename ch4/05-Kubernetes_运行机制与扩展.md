# 05 Kubernetes - 运行机制与扩展

### Controller

Controller是K8S中实现"自动化"运维的核心组件，通常情况下，K8S中的每一个对象都拥有一个对应的Controller，它的作用就是不断调整对象的实际状态（status），直到其符合用户声明的预期（spec）。

可以说K8S中关于一种对象的核心运行逻辑都在与之相对应的Controller之中，所以研究明白Controller就能研究明白K8S上层的运行机制。

#### Reconcile

上面讲了，Controller的核心逻辑就是不断检查对象的实际状态，并对比对象的期望状态进行调整，这个永不间断的循环过程被称为**Reconcile（调谐）**。

![img_34.png](img_34.png)

当然，Controller不可能真的以死循环的方式去运行，在实际实现上Controller会监听对象的变更，只有当对象的状态发生变更时才会触发Reconcile流程（具体的监听机制下文再展开）。

#### Client

在Reconcile逻辑的实际实现中，往往需要和K8S的API进行交互，比如获取对象的实际和期望状态、对指定对象进行更新等；这时候就需要在Controller代码中和K8S的API Server进行通信，
K8S官方提供了一套基于go语言的client SDK（本质上就是封装了API Server的Restful API调用），称为client-go，Controller的实现者可以通过这个client来与K8S集群的API进行交互。

![img_35.png](img_35.png)

#### Informer与List-Watch

在实际运行过程中，Controller的Reconcile逻辑中可能会大量且频繁的调用client，这会对API Server以及背后的etcd存储产生巨大的压力，进而对K8S集群的稳定性造成重大影响。

为了解决这个问题，K8S提供了一套缓存能力，可以帮助每个Controller创建一个独立的内存缓存，用于缓存Controller所需要监听的K8S对象数据，并且可以保证该缓存中的数据和etcd中的数据完全一致，
如此一来Controller内需要获取对象数据的时候就可以直接从该缓存中读取，不必再通过Client调用API Server，这套缓存能力被称为Informer。

> Informer缓存只能解决读操作的压力，对于写操作和删除操作还是需要直接通过client访问API Server的

Informer的工作原理是List-Watch机制，即在创建时，先通过client调用对象的List接口拿到一类对象的所有数据缓存到本地，然后通过Watch接口监听该类对象后续的所有变更，当发生变更时立刻同步变更本地缓存，如此便可保障Informer缓存中的对象数据和实际的对象数据始终保持一致。

![img_36.png](img_36.png)

#### 对象监听机制

#### Controller Manager

-- D4

### Operator模式

#### CRD

#### Webhook

#### Custom Controller

-- D4

### KubeBuilder

-- D5

### 实例：OpenKruise SidecarSet

-- D6/D7