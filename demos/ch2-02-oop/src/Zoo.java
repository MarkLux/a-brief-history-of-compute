/**
 * ch2-02 面向对象 Demo
 *
 * 展示了 Java 面向对象的三个核心特性：
 *   封装 (Encapsulation)、继承 (Inheritance)、多态 (Polymorphism)
 *
 * 如果你来自 JavaScript/TypeScript：
 *   - Java 的 class 是"编译时就固定结构"的模板
 *   - 没有原型链，所有方法调用在编译期就确定了签名
 *   - 多态通过继承+接口实现，类似 TS 的 interface + implements
 *
 * 运行: cd demos/ch2-02-oop && javac src/Zoo.java -d out && java -cp out Zoo
 */

// ========== 封装 ==========
// Animal 把 name 设为 private，外部只能通过 getName() 访问。
// 这保护了内部状态：外部不能随意修改 name。
abstract class Animal {
    private final String name;

    protected Animal(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    // 抽象方法：子类必须实现，相当于定义了一个"契约"
    public abstract String speak();
}

// ========== 继承 ==========
// Cat 和 Dog 继承 Animal，自动拥有 getName()。
// 它们只需要实现 speak() 自己的版本。
class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }

    @Override
    public String speak() {
        return "喵~ 我是 " + getName();
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public String speak() {
        return "汪! 我是 " + getName();
    }
}

// ========== 多态 ==========
// feed 方法接受 Animal（抽象父类），不关心具体是猫还是狗。
// 运行时根据实际对象类型调用正确的 speak() — 这就是多态。
public class Zoo {
    private static void feed(String food, Animal animal) {
        System.out.println("喂 " + animal.getName() + " 吃 " + food);
        System.out.println("  → " + animal.speak());
    }

    public static void main(String[] args) {
        Animal cat = new Cat("小橘");
        Animal dog = new Dog("大黄");

        feed("猫粮", cat);
        feed("骨头", dog);

        // 多态的真正威力：你可以加新动物而不改 feed 方法
        // 只需要 extends Animal + 实现 speak()
    }
}
