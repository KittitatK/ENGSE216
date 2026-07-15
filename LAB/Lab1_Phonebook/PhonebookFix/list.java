package LAB.Lab1_Phonebook.PhonebookFix;
//เอาไว้เรียงข้อมูลให้เหลือarrayเดียวจาก 3 array n[] surn[] tel[] Status: to do
public class list {
    private recordData[] data;
    int count = 0;
    int arrSize;

    public list(){
        this(9);
    }

    public list(int size){
        this.arrSize = size;
        this.data = new recordData[size];
    }

    void add(String name ,String surname, String tel){
        if (!isFull()){

            recordData n = new recordData(name, surname, tel);
            this.data[count]  = n;

            count++;
            System.out.println("\nState : Successful\n");
        }else{
            System.out.println("\nThere's no more space\n");
            System.out.println("\nState : Unsuccessful\n");
        }
    }

    void delete(int index){//แก้ไข

        if (!isEmpty() && index >= 0 && index < count){
            for(int i = index ; i<count-1 ;i++){//ขยับไปข้างหน้า
                data[i] = data[i+1];

            }   
            count--;
            data[count] = null;
        }else{
            System.out.println("");
            System.out.println("\nThere's empty space you can't delete!!\n");
        }
    }


    void edit(int e,String name2 ,String surname2, String tel2){
        if (!isEmpty() && e >= 0  && e < count){  
            

            recordData n2 = new recordData(name2, surname2, tel2);
            this.data[e] = n2;

            System.out.println("\nState : Successful\n");

        }else{ 
            System.out.println("_______________________________________");
            System.out.println("\nThere's empty space you can't edit!!\n");
            System.out.println("\nState : Unsuccessful\n");
        }
    }

    void insert(int it,String name3 ,String surname3, String tel3){
        
        if (!isEmpty() && it >= 0 && it < count){
            if (!isFull()) {

                for(int i = count ; i>it ;i--){//ขยับไปด้านหลัง

                    data[i] = data[i-1];
                    
                
                }   

                recordData n3 = new recordData(name3, surname3, tel3);
                data[it] = n3;
                count++;

                System.out.println("\nState : Successful\n");

            }else{
                System.out.println("\nThere's no space anymore\n");
                System.out.println("\nState : Unsuccessful\n");
            }
        }else{
            System.out.println("\nNo data\n");
            System.out.println("\nState : Unsuccessful\n");
        }

    }
    
    void sort() {
        if (!isEmpty()) {
            
            // ลูปชั้นนอก: กำหนดจำนวนรอบของการลอย (Bubble)
            for (int i = 0; i < count - 1; i++) {
                
                // ลูปชั้นใน: เปรียบเทียบข้อมูลคู่ติดกันไปเรื่อยๆ จนถึงตัวที่ยังไม่ได้จัดเรียง
                for (int j = 0; j < count - i - 1; j++) {
                    
                    // เปรียบเทียบชื่อตำแหน่ง j กับตำแหน่งถัดไป (j + 1)
                    // ถ้าค่าที่ได้ > 0 แสดงว่าชื่อตำแหน่ง j อยู่หลัง j+1 ตามตัวอักษร -> ต้องสลับที่!
                    if (data[j].name.compareToIgnoreCase(data[j + 1].name) > 0) {
                        
                        // 4. สลับที่ data ตามไปด้วย
                        recordData tempData = data[j];
                        data[j] = data[j + 1];
                        data[j + 1] = tempData;
                        
                    }
                }
            }
            System.out.println("\nSorted data successfully\n");
            
        } else {
            System.out.println("_______________________________________");
            System.out.println("\nDon't have data in system\n");
            System.out.println("\nState : Unsuccessful\n");
        }
    }


    boolean isFull(){
        return  count == this.data.length;
    }
    boolean isEmpty(){
        return count==0;
    }

    void showall(){
        System.out.printf("%-5s %-15s %-15s %-15s\n", "| No.", "| Name ", "| Surname", "| Tel.(+66)         |");
        for (int i = 0; i < count; i++) {
            
                System.out.printf("  %-5s %-15s %-15s %-15s\n",i+1,this.data[i].name,this.data[i].surname,this.data[i].tel);
            

            
            
        }
    }
    
}
