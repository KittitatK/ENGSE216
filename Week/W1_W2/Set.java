package Week.W1_W2;

public class Set {
    int data[] = new int[5];
    int count;
    void add(int data){
        if(!isfull()){
            if(!search(data)){
            this.data[count] = data;
            count++;
        }
            }
        else{
            System.out.println("Set is Full.");
        }
    }
    int remove(int index){
        int temp=-1;
        if(!isEmpty()){
        temp = data[index];
        this.data[index]=this.data[count-1];
        count--;
        }
        return temp;
    }
    
    int size(){
        return count;
    }
    boolean isfull(){
        return  count == this.data.length;
    }
    boolean isEmpty(){
        return count==0;
    }

    void showall(){
       for (int i = 0; i < count; i++) {
           System.out.println(this.data[i]);
       }
    }
    boolean found = false;
    boolean search(int item){
        for(int i = 0 ;i<count; i++){
            if(data[i] == item){
                i = count;
                found = true;
            }
        }
        return found;
    }
}