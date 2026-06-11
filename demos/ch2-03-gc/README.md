# ch2-03 Demo: 内存管理

## 目标

观察 JVM 堆内存分配和 GC 行为，理解引用类型。

## 运行

```bash
cd demos/ch2-03-gc
javac src/GcDemo.java -d out
java -cp out GcDemo

# 打开 GC 日志观察回收行为
java -verbose:gc -cp out GcDemo
```

## 对照文章

- "JVM 的内存分区" → 堆、栈、方法区
- "引用" → 强引用、软引用、弱引用、虚引用
- "垃圾回收机制" → 可达性分析、GC 触发时机

## 从前端视角

| V8 (JavaScript) | JVM (Java) |
|---|---|
| 不分引用类型 | 强/软/弱/虚四种引用 |
| GC 不可配置 | 7+ 种 GC 实现可选 |
| 分代假设（新生代/老生代） | 也分代，但更复杂 |
