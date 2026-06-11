# ch2-02 Demo: 面向对象

## 目标

通过一个简单动物园例子，动手理解封装、继承、多态。

## 运行

```bash
cd demos/ch2-02-oop
javac src/Zoo.java -d out && java -cp out Zoo
```

## 对照文章

- "面向对象编程思想" → 为什么要把状态和行为封装成对象
- "类与对象" → class 是模板，new 出来的实例才是对象
- "封装" → private 字段 + public getter
- "继承" → Cat/Dog extends Animal
- "多态" → feed() 接受 Animal，实际调用子类方法

## 从前端视角

| JavaScript/TS | Java |
|---|---|
| 原型链 | 类继承链 |
| `class` 是语法糖 | `class` 是编译时结构 |
| 动态类型，运行时检查 | 静态类型，编译时检查 |
| `interface` (TS) | `interface` + `abstract class` |
