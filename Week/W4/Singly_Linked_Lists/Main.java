package Week.W4.Singly_Linked_Lists;

public class Main {
    public static void main(String[] args) {
        SLinkedList list = new SLinkedList();
        list.add(12);
        list.add(8);
        list.add(3);
        list.showAll();
        list.addFirst(9);
        list.showAll();
    }
    
}
