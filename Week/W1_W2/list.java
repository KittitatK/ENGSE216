package Week.W1_W2;

public class list {
   int data[] = new int[5];
   int count;
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

      int size(){
        return count;
    }

    void add(int data){
        if(!isfull()){
            this.data[count] = data;
            count++;
        }
        else{
            System.out.println("isFull.");
        }
    }

    void delete(int idex){
        for(int i = idex ; i<count-1 ;i++){
            data[i] = data[i+1];
        }   
        count--;
    }

    void insert(int index , int item){
        if(!isfull()){
            if(index<count && index>=0){
                for(int i = count-1 ; i>=index;i--){
                 data[i+1] = data[i];
                }
            }
            data[index] = item;
            count++;
        }
    }
}

