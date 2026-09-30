package Week.W3.Queue;

public class TestQueue {
    
    public static void main(String[] args){
        Queue q = new Queue();
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);
        q.enqueue(4);
        q.enqueue(5);
        q.enqueue(6);
        q.showAll();
        q.dequeue(); //1
        q.showAll();
        q.dequeue();//2
        q.showAll();
        q.dequeue();//3
        q.showAll();
        q.dequeue();//4
        q.showAll();
        q.dequeue();//5
        q.showAll();
        q.dequeue();//Empty
        q.showAll();
    }
}
