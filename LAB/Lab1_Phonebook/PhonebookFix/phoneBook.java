package LAB.Lab1_Phonebook.PhonebookFix;

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
        System.out.print("Which NO. you want to delete : ");
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

        System.out.println("NO. : ");
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
        System.out.print("NO. : ");
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

}
