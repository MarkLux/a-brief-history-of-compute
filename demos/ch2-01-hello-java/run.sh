#!/bin/bash
set -e

echo "=== ch2-01 Demo: 高级语言的演进之路 ==="
echo ""
echo "Step 1: 编译 Java 源代码 → 字节码 (.class)"
echo "  javac src/HelloJava.java"
echo ""

cd "$(dirname "$0")"
javac src/HelloJava.java -d out 2>/dev/null && echo "  ✓ 编译成功，生成 out/HelloJava.class" || {
  echo "  ✗ javac 未找到，请先安装 JDK: brew install openjdk@17"
  exit 1
}

echo ""
echo "Step 2: 反编译查看字节码指令（窥探 JVM 会执行的指令）"
echo "  javap -c out/HelloJava"
echo ""

# Only show a snippet of main
javap -c -p out/HelloJava 2>/dev/null | head -20

echo "  ... (更多指令省略)"
echo ""

echo "Step 3: JVM 运行字节码"
echo "  java -cp out HelloJava"
echo ""

java -cp out HelloJava

echo ""
echo "=== Demo 完成 ==="
echo "思考："
echo "  1. javac 编译后你得到了什么？一个 .class 文件（字节码），不是机器码"
echo "  2. java 命令启动的是 JVM，JVM 负责解释/执行字节码"
echo "  3. 同一份 HelloJava.class 可以在任何有 JVM 的平台上运行"
echo "  4. 这就是 '半编译半解释' — 编译成字节码，运行时再解释+JIT优化"
