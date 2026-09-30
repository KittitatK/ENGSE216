package Week.W3.Queue.CirclularQueue.ErrorFile;



import java.util.NoSuchElementException;



public class ErrorCirclularQueue {

    private int q[] = new int[5];
    private int f,r,count; //font, rear, count

    public ErrorCirclularQueue(int initialSize){
        this.f = this.r = -1; //note :โดยที่ r ตอนเริ่มคือ -1
                             //note :สั่ง q[-1] โปรแกรมจะแจ้ง Error ว่าไม่มีช่องติดลบในอาเรย์เต้อง "ขยับ r ไปก่อน แล้วค่อยใส่ข้อมูล"
        this.q = new int[initialSize];
    }

    public int peek(){
        if(isEmpty()){
            throw new NoSuchElementException("Queue is empty");
        }
        return q[f];  
    }

    private void resize(){

        int [] tempArray = new int[q.length * 2];
        int i = 0;
        int j = f;

        do{
            tempArray[i++] = q[j];
            j = (j + 1) % q.length;
        }while(j != f);

        f = 0;
        r = q.length - 1;
        q = tempArray;
    }

    void enqueue(int item){

        if(!isFull()){
            q[r] = item;
            r = (r+1) % q.length;          
            count++;
        }else{
            resize();
            System.out.println("Queue is full!!"+"("+item+")");
        }

        if(isEmpty()){
            f++;
            r = (r+1) % q.length;
            q[r] = item;
        }
    }

    int dequeue(){

        int temp = q[f];
        if(!isEmpty()){
            if (f == r){
                f = r = -1;
            }else{
                f = (f+1) % q.length;
            }  
        }else{
            System.out.println("Queue is Empty!!");
        }

        return temp;
    }

    boolean isFull(){
        return (r + 1) % q.length == f;
    }

    boolean isEmpty(){
        return f == -1;
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

