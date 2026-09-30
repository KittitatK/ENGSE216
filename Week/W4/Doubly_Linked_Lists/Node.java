package Week.W4.Doubly_Linked_Lists;

public class Node {
    int info;
    Node next; // ชี้ไปโหนดถัดไป
    Node prev; // ชี้ไปโหนดก่อนหน้า

    // สร้าง Constructor เพื่อความสะดวกในการใช้งาน
    public Node(int item) {
        this.info = item;
        this.next = null;
        this.prev = null;
    }
}