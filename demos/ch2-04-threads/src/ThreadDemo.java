/**
 * ch2-04 线程并发 Demo
 *
 * 从前端开发者的视角理解线程：
 *   - 浏览器 JS 是事件循环（单线程）调度异步任务
 *   - Java 线程是真正的并发执行单元，多个线程可以同时跑在不同 CPU 核上
 *   - 线程共享堆内存 → 需要同步机制（synchronized、volatile 等）
 *
 * 演示内容：
 *   1. 创建线程的两种方式： extends Thread / implements Runnable
 *   2. 共享变量竞态问题
 *   3. synchronized 同步
 *   4. interrupt 协作式打断
 *
 * 运行: cd demos/ch2-04-threads && javac src/ThreadDemo.java -d out && java -cp out ThreadDemo
 */

public class ThreadDemo {
    // 线程间共享的计数器 — 不加同步会出竞态
    private static int counter = 0;
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== 1. 创建线程：extends Thread vs implements Runnable ===");
        Thread t1 = new MyThread("Worker-A");
        Thread t2 = new Thread(new MyRunnable("Worker-B"));
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println();

        System.out.println("=== 2. 竞态问题：两个线程同时 ++counter ===");
        counter = 0;
        Runnable unsafeInc = () -> {
            for (int i = 0; i < 10000; i++) {
                counter++; // 非原子操作：读取 → +1 → 写回
            }
        };
        Thread a = new Thread(unsafeInc);
        Thread b = new Thread(unsafeInc);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("不加同步: counter = " + counter + " (期望 20000)");

        // 前端类比：两个异步回调同时改一个 DOM 变量，
        // 但 JS 是单线程的，这种情况不会出现；
        // Java 里多个线程真的在并发执行。
        System.out.println();

        System.out.println("=== 3. synchronized 同步 ===");
        counter = 0;
        Runnable safeInc = () -> {
            for (int i = 0; i < 10000; i++) {
                synchronized (lock) {
                    counter++;
                }
            }
        };
        a = new Thread(safeInc);
        b = new Thread(safeInc);
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println("加 synchronized: counter = " + counter + " (期望 20000)");
        System.out.println();

        System.out.println("=== 4. interrupt 协作式打断 ===");
        Thread sleeper = new Thread(() -> {
            try {
                System.out.println("  子线程：开始睡觉 5 秒...");
                Thread.sleep(5000);
                System.out.println("  子线程：睡完了");
            } catch (InterruptedException e) {
                System.out.println("  子线程：被 interrupt 叫醒了！");
                // 这里可以优雅退出 — interrupt 不是强制杀死
            }
        });
        sleeper.start();
        Thread.sleep(500); // 等一下让它进入 sleep
        System.out.println("  主线程：interrupt 子线程");
        sleeper.interrupt();
        sleeper.join();
        System.out.println("  对比：JS 没有 sleep，只能靠 setTimeout/async 模拟非阻塞等待");

        System.out.println();
        System.out.println("=== 从前端视角小结 ===");
        System.out.println("  事件循环: 单线程，任务排队 → 适合 I/O 密集的 UI 场景");
        System.out.println("  多线程:   真正并发 → 适合 CPU 密集计算 + 共享内存协作");
        System.out.println("  线程模型:  共享堆内存 → 需要锁/原子类 → 复杂度更高");
    }

    // 方式 1: extends Thread（与 Thread 耦合）
    static class MyThread extends Thread {
        MyThread(String name) {
            super(name);
        }

        @Override
        public void run() {
            System.out.println("  " + getName() + ": extends Thread 方式");
        }
    }

    // 方式 2: implements Runnable（推荐，更灵活）
    static class MyRunnable implements Runnable {
        private final String name;

        MyRunnable(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            System.out.println("  " + name + ": implements Runnable 方式");
        }
    }
}
