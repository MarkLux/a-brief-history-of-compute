# ch2-01 Demo: 高级语言的演进之路

## 目标

通过动手实操，理解 Java "半编译半解释" 的运行链路：

```text
.java 源码 → javac → .class 字节码 → JVM 解释运行 → JIT 热点优化
```

## 前置条件

```bash
brew install openjdk@17          # macOS 安装 JDK
java -version                    # 确认安装成功
```

## 运行

```bash
chmod +x run.sh && ./run.sh
```

## 你会看到什么

1. **编译阶段** — javac 把 `HelloJava.java` 变成 `HelloJava.class` 字节码
2. **字节码预览** — javap 反编译，展示类似汇编的 JVM 指令
3. **运行阶段** — JVM 执行字节码，同时打印平台信息

## 对照文章阅读

- 文章 "从汇编到C语言" → 对应汇编/机器语言的前两次抽象
- 文章 "Java代码是如何运行的" → 对应 javac → 字节码 → JVM 流程
- 文章 "JIT" → JIT 是 JVM 在运行一段时间后对热点代码的即时编译优化
