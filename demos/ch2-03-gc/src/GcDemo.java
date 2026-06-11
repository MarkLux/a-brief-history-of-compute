/**
 * ch2-03 内存管理 Demo
 *
 * 演示 JVM 内存管理的几个关键概念：
 *   1. 对象在堆上分配，方法局部变量在栈上
 *   2. GC 回收不可达对象
 *   3. 强引用 vs 软引用 vs 弱引用
 *
 * 运行:
 *   cd demos/ch2-03-gc
 *   javac src/GcDemo.java -d out
 *   java -cp out GcDemo                    # 普通运行
 *   java -Xlog:gc -cp out GcDemo           # 查看 GC 日志（新版 JDK）
 *   java -verbose:gc -cp out GcDemo        # 查看 GC 日志（旧版 JDK）
 */
import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class GcDemo {
    // 静态变量不会被 GC（因为始终可达 — GC Root 可达）
    private static List<byte[]> globalCache = new ArrayList<>();

    public static void main(String[] args) {
        System.out.println("=== 1. 强引用：不会被 GC ===");
        String strongRef = new String("我活着");
        System.out.println("强引用对象: " + strongRef);
        System.gc(); // 建议 GC 运行（但不保证）
        System.out.println("GC 后强引用: " + strongRef + " (还在)");
        System.out.println();

        System.out.println("=== 2. 弱引用：下次 GC 会被回收 ===");
        String target = new String("弱引用目标");
        WeakReference<String> weakRef = new WeakReference<>(target);
        System.out.println("GC 前 weakRef.get(): " + weakRef.get());
        target = null; // 让强引用断开
        System.gc();
        System.out.println("GC 后 weakRef.get(): " + weakRef.get() + " (大概率 null)");
        System.out.println();

        System.out.println("=== 3. 软引用：内存充足时不会被回收 ===");
        byte[] bigData = new byte[10 * 1024 * 1024]; // 10MB
        SoftReference<byte[]> softRef = new SoftReference<>(bigData);
        System.out.println("GC 前 softRef.get() != null: " + (softRef.get() != null));
        bigData = null; // 断开强引用
        System.gc();
        // 内存充足时软引用不会被回收 — 这和弱引用不同
        System.out.println("GC 后 softRef.get() != null: " + (softRef.get() != null));
        System.out.println("（内存充足时软引用不会被回收，而弱引用会被回收）");
        System.out.println();

        System.out.println("=== 4. 对比：强引用 vs 软引用 vs 弱引用 ===");
        System.out.println("强引用: 始终可达 → 不会被回收");
        System.out.println("软引用: 内存不足时回收 → 适合做缓存");
        System.out.println("弱引用: 下次 GC 就回收 → 生命周期最短");
        System.out.println("虚引用: 几乎等同于没有引用 → 用于跟踪对象回收时机");
        System.out.println();
        System.out.println("=== 从前端视角 ===");
        System.out.println("V8 的 GC 你比较熟悉：Mark-Sweep、分代、增量标记。");
        System.out.println("JVM GC 的核心区别：");
        System.out.println("  1. JVM 有多达 7 种 GC 实现可选（G1、ZGC、Shenandoah...）");
        System.out.println("  2. JVM 的 GC 日志和分析工具更丰富（jstat、GCViewer）");
        System.out.println("  3. 引用类型（强/软/弱/虚）是 JVM 独有的，V8 没有这个概念");
    }
}
