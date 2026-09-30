package Week.W3.Queue.CirclularQueue.ErrorFile;

public class ErrorTestCirclular {

    public static void main(String[] args) {
        int n = 5;
        ErrorCirclularQueue cq = new ErrorCirclularQueue(n);

        System.out.println("\n--- 1. ทดสอบเพิ่มข้อมูลจนเต็มคิว (ขนาด 5) ---\n");
        cq.enqueue(1);
        cq.enqueue(2);
        cq.enqueue(3);
        cq.enqueue(4);
        cq.enqueue(5);
        cq.showAll(); // คาดหวัง: 1 2 3 4 5

        System.out.println("\n--- 2. ทดสอบเพิ่มข้อมูลตัวที่ 6 (ระบบต้อง Resize ตัวเอง) ---\n");
        cq.enqueue(6); 
        cq.showAll(); // คาดหวัง: 1 2 3 4 5 6

        System.out.println("\n--- 3. ทดสอบการดึงข้อมูล (Dequeue) 2 ครั้ง ---\n");
        System.out.println("ดึงข้อมูลออก: " + cq.dequeue()); // 1
        System.out.println("ดึงข้อมูลออก: " + cq.dequeue()); // 2
        cq.showAll(); // คาดหวัง: 3 4 5 6

        System.out.println("\n--- 4. ทดสอบความสามารถแบบ 'วงกลม' (เพิ่ม 7, 8) ---\n");
        // ถ้าเป็นคิวปกติ ตอนนี้ท้ายอาเรย์จะเต็มแล้ว แต่ Circular Queue จะวนเอา 7, 8 ไปใส่ข้างหน้า
        cq.enqueue(7);
        cq.enqueue(8);
        cq.showAll(); // คาดหวัง: 3 4 5 6 7 8

        System.out.println("\n--- 5. ทดสอบเอาข้อมูลออกให้หมด ---\n");
        while (!cq.isEmpty()) {
            System.out.println("ดึงข้อมูลออก: " + cq.dequeue());
        }
        cq.showAll(); // คาดหวัง: Queue is empty...

        System.out.println("\n--- 6. ทดสอบการดึงข้อมูลเมื่อคิวว่าง ---\n");
        try {
            cq.dequeue(); // ตรงนี้จะ Error ระบบจะจับ Exception ไว้
        } catch (Exception e) {
            System.out.println("จับ Error ได้: " + e.getMessage());
        }
    }
}