# ch2-04 Demo: 线程并发

## 目标

从前端事件循环的视角理解 Java 多线程。

## 运行

```bash
cd demos/ch2-04-threads
javac src/ThreadDemo.java -d out && java -cp out ThreadDemo
```

## 对照文章

- "线程的基本概念" → Thread vs Runnable
- "Java 线程状态" → NEW → RUNNABLE → BLOCKED/WAITING → TERMINATED
- "抢占式调度" → OS 决定谁跑，而不是程序员手动让出
- "线程打断机制" → interrupt 是协作信号，不是暴力 kill

## 从前端视角

| 浏览器 JS 事件循环 | Java 多线程 |
|---|---|
| 单线程，任务排队 | 多线程，真并发 |
| 无共享内存竞态 | 需要 synchronized/volatile |
| setTimeout/async 模拟等待 | Thread.sleep() + interrupt |
| Web Worker 可并行但不共享对象 | 线程共享堆内存 |
