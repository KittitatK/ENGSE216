package Week.W3.Queue;

public class Queue {
    int q[] = new int[5];
    int f,r,count; //font, rear, count

    void enqueue(int item){
        if(!isFull()){
            q[r] = item;        
            r = (r+1) % q.length;          
            count++;
        }else{
            System.out.println("Queue is full!!"+"("+item+")");
        }
    }

    int dequeue(){
        int temp = -1;
        if(!isEmpty()){
            temp = q[f];
            f = (f+1) % q.length;
            count--;
        }else{
            System.out.println("Queue is Empty!!");
        }
        return temp;
    }

    boolean isFull(){
        return size() == q.length;
    }

    boolean isEmpty(){
        return size() == 0;
    }

    int size(){
        return count;
    }

    void showAll(){
        int index;
        index = f;
        for(int i = 1 ; i <= count; i++){
            System.out.println(q[index] + " ");
            index = (index+1) % q.length;
        }
        System.out.println("--------------------");
    }
}
