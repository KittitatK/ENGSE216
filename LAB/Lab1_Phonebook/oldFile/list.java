package LAB.Lab1_Phonebook.oldFile;

public class list {

   private int data[] = new int[999];
   private String name[] = new String[999];
   private String surname[] = new String[999];
   private String tel[] = new String[999];
    int count;
    
    void add(String name ,String surname, String tel){
        if (!isfull()){
            int n = 0;
            this.data[count]  = n;
            this.name[count] = name;
            this.surname[count] = surname;
            this.tel[count] = tel;
            n++;
            count++;
        }else{
            System.out.println("There's no more space");
        }
    }

    void delete(int index){//แก้ไข

        if (!isEmpty() && index >= 0 && index < count){
            for(int i = index ; i<count-1 ;i++){//ขยับไปข้างหน้า
                data[i] = data[i+1];
                name[i] = name[i+1];
                surname[i] = surname[i+1];
                tel[i] = tel[i+1];

            }   
            count--;
        }else{
            System.out.println("");
            System.out.println("There's empty space you can't delete!!\n");
        }
    }


    void edit(int e,String name2 ,String surname2, String tel2){
        if (!isEmpty() && e >= 0  && e < count){  
            
            this.name[e] = name2;
            this.surname[e] = surname2;
            this.tel[e] = tel2;  

        }else{ 
            System.out.println("_______________________________________");
            System.out.println("There's empty space you can't edit!!\n");
        }
    }

    void insert(int it,String name3 ,String surname3, String tel3){
        
        if (!isEmpty() && it >= 0 && it < count){
            int n3 = 0;

                for(int i = count ; i>it ;i--){//ขยับไปด้านหลัง

                    data[i] = data[i-1];
                    name[i] = name[i-1];
                    surname[i] = surname[i-1];
                    tel[i] = tel[i-1];
                
                }   

            data[it] = n3;
            name[it] = name3;
            surname[it] = surname3;
            tel[it] = tel3;

            n3++;
            count++;
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
                    if (name[j].compareToIgnoreCase(name[j + 1]) > 0) {
                        
                        // 1. สลับที่ชื่อ (name) โดยใช้ตัวแปรชั่วคราว (temp)
                        String tempName = name[j];
                        name[j] = name[j + 1];
                        name[j + 1] = tempName;

                        // 2. สลับที่นามสกุล (surname) ตามไปด้วย!
                        String tempSurname = surname[j];
                        surname[j] = surname[j + 1];
                        surname[j + 1] = tempSurname;

                        // 3. สลับที่เบอร์โทร (tel) ตามไปด้วย!
                        String tempTel = tel[j];
                        tel[j] = tel[j + 1];
                        tel[j + 1] = tempTel;

                        // 4. สลับที่ data ตามไปด้วย
                        int tempData = data[j];
                        data[j] = data[j + 1];
                        data[j + 1] = tempData;
                        
                    }
                }
            }
            System.out.println("\"Sorted data successfully");
            
        } else {
            System.out.println("_______________________________________");
            System.out.println("DDon't have data in system\n");
        }
    }


    boolean isfull(){
        return  count == this.data.length;
    }
    boolean isEmpty(){
        return count==0;
    }

    void showall(){
        System.out.printf("%-5s %-15s %-15s %-15s\n", "| No.", "| Name ", "| Surname", "| Tel.(+66)         |");
       for (int i = 0; i < count; i++) {

           System.out.printf("  %-5s %-15s %-15s %-15s\n",this.data[i]+i,this.name[i],this.surname[i],this.tel[i]);
          
       }
    }
}
    