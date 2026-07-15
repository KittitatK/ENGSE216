package Week.W1_W2;

public class Collection {
        int data[] = new int[5];
        int count = 0;

        /*void search(int d){ // เพิ่มการเช็ค แล้วค่อยตรงว่าเต็มไหม

                for (int i = 0; i < count; i++) {
                    if (data[i] == d) {
                        System.out.println("false");
                        return;
                    }
                }
                //throw new IllegalArgumentException("you have the same information"); 

                if(!isFull()){
                    data[count] = d;
                    count++;
                    System.out.println("true"); 
                }
            
        }*/

        void add(int d){
            if(!isFull()){
                data[count] = d;
                count++;

            }
        } 

        int remove(int id){
            int temp = -1;
            if(!isEmpty()){
                temp = data[id];
                data[id] = data[count-1];
                count--;
            }
            
            return temp;
        }

        int size () { return count; }

        boolean isFull(){return count == data.length;}

        boolean isEmpty(){return count == 0;}

        void show(){
            for (int i = 0 ; i < count ; i++){
                System.out.println(data[i]);
            }
        }

    
    
}
