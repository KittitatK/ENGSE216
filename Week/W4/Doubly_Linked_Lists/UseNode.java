package Week.W4.Doubly_Linked_Lists;

public class UseNode {
    public static void main(String[] args) {
        LinkedCollection collection = new LinkedCollection();

        // ทดสอบดักจับ Error กรณี List ว่าง
        collection.remove(1); 

        // เพิ่มข้อมูล
        collection.add(10);
        collection.add(20);
        collection.add(30);
        collection.add(40);

        System.out.println("--- All nodes ---");
        collection.showAll();

        // ทดสอบดักจับ Error กรณีใส่เลขเกิน
        System.out.println("--- Try removing out of bounds ---");
        collection.remove(5); 

        // ทดสอบลบตรงกลาง (ลบ 20 ซึ่งอยู่ลำดับ 2)
        System.out.println("--- Remove order 2 ---");
        collection.remove(2);
        collection.showAll();

        // ทดสอบการวิ่งย้อนกลับ (เพื่อยืนยันว่า Doubly Linked List เชื่อม prev ถูกต้อง)
        System.out.println("--- Reverse show ---");
        collection.showReverse();
    }
}