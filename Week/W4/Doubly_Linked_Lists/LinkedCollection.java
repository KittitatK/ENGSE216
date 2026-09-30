package Week.W4.Doubly_Linked_Lists;

public class LinkedCollection {

    private int size = 0; // เปลี่ยนเป็น private และกำหนดค่าเริ่มต้น
    private Node head, tail;

    // เพิ่มข้อมูลต่อท้าย
    public void add(int item) {
        Node n = new Node(item);
        if (size == 0) {
            head = n;
            tail = n;
        } else {
            tail.next = n; // ให้ tail เดิมชี้ next ไปที่ Node ใหม่
            n.prev = tail; // ให้ Node ใหม่ชี้ prev กลับมาที่ tail เดิม
            tail = n;      // ขยับ tail มาที่ Node ใหม่
        }
        size++;
    }

    public void showAll() {
        Node travel = head; // ประกาศ travel เป็น Local variable ปลอดภัยกว่า
        if (travel == null) {
            System.out.println("Collection is empty.");
            return;
        }
        while (travel != null) {
            System.out.println(travel.info);
            travel = travel.next;
        }
    }

    // สามารถเพิ่ม showReverse เพื่อทดสอบการย้อนกลับของ Doubly Linked List ได้
    public void showReverse() {
        Node travel = tail;
        while (travel != null) {
            System.out.println(travel.info);
            travel = travel.prev;
        }
    }

    public void remove(int order) {
        // 1. ดักจับข้อผิดพลาด: List ว่าง
        if (size == 0) {
            System.out.println("Error: Collection is empty. Cannot remove.");
            return;
        }

        // 2. ดักจับข้อผิดพลาด: ลำดับที่ระบุไม่อยู่ในขอบเขต
        if (order < 1 || order > size) {
            System.out.println("Error: Invalid order. Must be between 1 and " + size);
            return;
        }

        // กรณีลบ Node แรก
        if (order == 1) {
            if (size == 1) { // มี Node เดียว
                head = null;
                tail = null;
            } else { // มีมากกว่า 1 Node
                head = head.next;
                head.prev = null; // ตัดการเชื่อมต่อย้อนกลับ
            }
        } 
        // กรณีลบ Node สุดท้าย
        else if (order == size) {
            tail = tail.prev;     // ถอย tail ไป 1 สเต็ป (ทำได้ทันทีเพราะเป็น Doubly)
            tail.next = null;     // ตัดการเชื่อมต่อไปยัง Node ที่ถูกลบ
        } 
        // กรณีลบ Node ตรงกลาง
        else {
            Node travel = head;
            // วนลูปไปหา Node ที่ต้องการลบ
            for (int i = 1; i < order; i++) {
                travel = travel.next;
            }
            // เชื่อม Node ก่อนหน้า กับ Node ถัดไปเข้าด้วยกัน (ข้าม Node ปัจจุบัน)
            travel.prev.next = travel.next;
            travel.next.prev = travel.prev;
        }
        
        size--;
    }
    
    public int getSize() {
        return size;
    }
}