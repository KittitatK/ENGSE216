package LAB.Lab1_Phonebook.Phonebook;

//เป็นตัวดึงข้อมูล record มาทำฟังก์ชั่น add del insert edit sort
import java.util.Scanner;

public class phoneBook {

    list l = new list();
    Scanner input = new Scanner(System.in);
    int data;

    public void setList(){
        System.out.print("Enter infosize or press Enter for default(9): ");
        String arrSize = input.nextLine();

        if(arrSize.isEmpty()){
            l = new list();
            

        }else{
            data = Integer.parseInt(arrSize);
            l =  new list(data);
        }
    }

    public void add(){

        l.showall();

        System.out.print("Name : ");
        String n = input.nextLine();
                    
        System.out.print("SurName : ");
        String s = input.nextLine();
        
        System.out.print("Tel : ");
        String t = input.nextLine();

        
        
            
        

        
        l.add(n,s,t);
        l.showall();

    }

    public void delete(){

        l.showall();

        System.out.print("Which NO. you want to delete : ");
        while (!input.hasNextInt()) {
            System.out.println("Error: input only integer");
            System.out.print("Press the number : ");
            
            input.next(); // เคลียร์ข้อความ String ขยะที่ผู้ใช้พิมพ์ค้างไว้ทิ้งไป
        }

        int d1 = input.nextInt();
                    

        for (int i = 0 ; i <1 ; i++){
            System.out.print("\nYou want to delete ? : Yes =(1) , No =(0)");
            int dicition = input.nextInt();
            input.nextLine();

            if (dicition == 1){
                                
                int d2 = d1;
                System.out.println("Confirm\n");
                l.delete(d2 - 1);
                System.out.println("\nState : Successful\n");
                l.showall();

            }else if (dicition == 0){

                System.out.println("\nCancel\n");
                System.out.println("\nState : Unsuccessful\n");

            }else{
                System.out.print("Please Enter Only : (1) , (0)\n");
                i--;
            }
        }
        
    }

    public void edit(){

        l.showall();

        System.out.println("NO. : ");
        while (!input.hasNextInt()) {
            System.out.println("Error: input only integer");
            System.out.print("Press the number : ");
            
            input.next(); // เคลียร์ข้อความ String ขยะที่ผู้ใช้พิมพ์ค้างไว้ทิ้งไป
        }

        int edno = input.nextInt();
        input.nextLine();

        System.out.print("Name : ");
        String edn = input.nextLine();
                    
        System.out.print("SurName : ");
        String eds = input.nextLine();
                    
        System.out.print("Tel : ");
        String edt = input.nextLine();

        l.edit(edno - 1, edn, eds, edt);
        l.showall();

        
    }

    public void insert(){

        l.showall();

        System.out.print("NO. : ");
        while (!input.hasNextInt()) {
            System.out.println("Error: input only integer");
            System.out.print("Press the number : ");
            
            input.next(); // เคลียร์ข้อความ String ขยะที่ผู้ใช้พิมพ์ค้างไว้ทิ้งไป
        }

        int itno = input.nextInt();
        input.nextLine();


        System.out.print("Name : ");
        String itn = input.nextLine();
                    
        System.out.print("SurName : ");
        String its = input.nextLine();
                    
        System.out.print("Tel : ");
        String itt = input.nextLine();

        l.insert(itno - 1, itn, its, itt);
        l.showall();

        
    }

    public void sort(){
        System.out.println("Sorting...\n");
        l.sort();
        l.showall();

        
    }

    public void end(){
        l.showall();
    }


    public void dataBasic(){
        System.out.println("\n--- Loading Basic Data... ---");
        
        l.add("Somchai","Jaidee","0875981364");
        l.add("Jo-ai","Datunde","0895971314");
        l.add("Wyatt","Lay","0795981344");
        l.add("Paris","Lei","0475881544");
        
        System.out.println("--- Basic Data Loaded! ---\n");
    }
}
