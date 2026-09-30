package Week.W3.Queue.CirclularQueue;

import java.util.NoSuchElementException;

public class CirclularQueue {

    private int q[];
    private int f, r, count; // front, rear, count

    public CirclularQueue(int initialSize) {
        this.f = this.r = -1;
        this.count = 0;
        this.q = new int[initialSize];
    }

    public int peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return q[f];
    }

    private void resize() {
        // สร้างอาเรย์ใหม่ใหญ่เป็น 2 เท่า
        int[] tempArray = new int[q.length * 2];
        int j = f;

        // วนลูปย้ายข้อมูลตามจำนวน count ที่มีอยู่จริง (ปลอดภัยกว่า)
        for (int i = 0; i < count; i++) {
            tempArray[i] = q[j];
            j = (j + 1) % q.length;
        }

        // รีเซ็ตตัวชี้และสลับอาเรย์
        q = tempArray;
        f = 0;
        r = count - 1;
    }

    public void enqueue(int item) {
        // 1. ถ้าเต็ม ให้ขยายขนาดก่อน
        if (isFull()) {
            resize();
            System.out.println("Queue Resized for item: (" + item + ")");
        }

        // 2. ถ้าคิวเพิ่งว่างเลย ให้เริ่ม f ที่ 0
        if (isEmpty()) {
            f = 0;
        }

        // 3. ขยับ r ไปข้างหน้า 1 ตำแหน่ง แล้วใส่ข้อมูล
        r = (r + 1) % q.length;
        q[r] = item;
        count++; // เพิ่มจำนวน
    }

    public int dequeue() {
        // 1. เช็คคิวว่างก่อนเป็นอันดับแรก จะได้ไม่ Error
        if (isEmpty()) {
            System.out.println("Queue is Empty!!");
            throw new NoSuchElementException("Cannot dequeue from an empty queue");
        }

        // 2. ดึงข้อมูลตัวหน้าสุดเก็บไว้
        int temp = q[f];

        // 3. จัดการขยับตัวชี้
        if (f == r) {
            // ถ้ามีตัวเดียว ดึงออกแล้วต้องกลับไปสถานะว่าง
            f = r = -1;
        } else {
            // ถ้ามีหลายตัว ให้ f ขยับไปข้างหน้า 1 ก้าวแบบวงกลม
            f = (f + 1) % q.length;
        }

        count--; // สำคัญมาก: ลดจำนวนลง
        return temp;
    }

    public boolean isFull() {
        // แบบนี้เช็คได้ชัวร์กว่าเมื่อเรามีตัวแปร count
        return count == q.length;
    }

    public boolean isEmpty() {
        return count == 0;
    }

    public int size() {
        return count;
    }

    public void showAll() {
        if (isEmpty()) {
            System.out.println("Queue is empty. Nothing to show.");
            return;
        }
        
        int index = f;
        for (int i = 0; i < count; i++) {
            System.out.print(q[index] + " ");
            index = (index + 1) % q.length;
        }
        System.out.println("\n--------------------");
    }
}