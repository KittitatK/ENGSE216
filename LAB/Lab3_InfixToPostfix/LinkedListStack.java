package LAB.Lab3_InfixToPostfix;

public class LinkedListStack { //ตัวจจัดการ stack
    private Node head; // ตัวชี้ไปยังโหนดบนสุดของ stack

    public void push(char data){
        Node n = new Node(data); // สร้างโหนดใหม่
        n.link = head; // เชื่อมโยงโหนดใหม่กับโหนดบนสุดปัจจุบัน
        head = n;
    }

    public char pop(){
        if (isEmpty()) {
            return '\0';
        }else{
            char popdata = head.data;
            head = head.link;
            return popdata;
        }
    }

    public char peek(){
        if (isEmpty()) {
            return '\0';
        } else {
            return head.data;
        }
    }


    public boolean isEmpty(){
        return head == null; // ตรวจสอบว่า stack ว่างหรือไม่
    }

    public String displayStack() {
        StringBuilder sb = new StringBuilder();
        Node current = head;
        
        // วิ่งลูปจากบนลงล่าง แต่ตอนต่อ String ให้แทรกไว้ข้างหน้า (เพื่อให้ฐานอยู่ซ้าย ยอดอยู่ขวา)
        while (current != null) {
            sb.insert(0, current.data + " "); 
            current = current.link;
        }
        
        if (sb.length() == 0) {
            return "null"; // ถ้า Stack ว่างให้พิมพ์คำว่า null
        }
        return sb.toString().trim();
    }

    
}
