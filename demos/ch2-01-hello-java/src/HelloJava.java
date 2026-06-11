/**
 * ch2-01 高级语言的演进之路 Demo
 *
 * 这个文件展示了 Java 从源码到运行的完整链路：
 *   源代码 (.java) → javac 编译 → 字节码 (.class) → JVM 解释/执行
 *
 * 运行步骤（见 README.md）：
 *   1. javac HelloJava.java      → 生成 HelloJava.class
 *   2. javap -c HelloJava         → 反编译查看字节码指令
 *   3. java HelloJava             → JVM 执行字节码
 */
public class HelloJava {
    public static void main(String[] args) {
        String lang = "Java";
        int year = 1996;

        // Java 是静态类型语言：变量类型在编译时确定
        System.out.println(lang + " 诞生于 " + year + " 年");

        // 如果你学过来自前端的动态类型语言（如 JavaScript），
        // 这里的关键差异是：编译期就完成了类型检查，
        // 而不是在运行时才报告类型错误。
        printPlatformInfo();
    }

    private static void printPlatformInfo() {
        String os = System.getProperty("os.name");
        String javaVersion = System.getProperty("java.version");
        String vmName = System.getProperty("java.vm.name");

        System.out.println("--- 运行时平台信息 ---");
        System.out.println("OS: " + os);
        System.out.println("Java 版本: " + javaVersion);
        System.out.println("虚拟机: " + vmName);
        System.out.println("---");

        // JVM 屏蔽了底层操作系统差异 — 这段代码
        // 在 macOS、Windows、Linux 上输出不同，
        // 但不需要改任何 Java 代码。
        // 这就是"一次编译，处处运行"的体现。
    }
}
