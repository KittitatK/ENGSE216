package LAB.Lab1_Phonebook;

import java.util.Scanner;

public class mainPro {
    public static void main(String[] phonebook){

        Scanner input =  new Scanner(System.in);
        list ad = new list();
        int c;
        
        do {
                
            System.out.println("\nadd number press    ( 1 ) , edit number press ( 2 )");
            System.out.println("insert number press ( 3 ) , sort number press ( 4 )");
            System.out.println("delete number press ( 5 ) , Close the program ( 0 )\n");

            System.out.println("Press the number : ");

            while (!input.hasNextInt()) {//เช็คว่าเผลอพิมพ์อย่างอื่นน้องจากค่า int หรือไม่
                System.out.println("Error: Enter Only Integer!");
                System.out.print("Press the number again : ");
                input.next(); // เคลียร์ข้อความขยะที่ผู้ใช้พิมพ์มา
            }

            c = input.nextInt();
            input.nextLine();
                
            switch (c) {
                case 1:
                    
                    System.out.println("Name : ");
                    String n = input.nextLine();
                    
                    System.out.println("SurName : ");
                    String s = input.nextLine();
                    
                    System.out.println("Tel : ");
                    String t = input.nextLine();
                    input.nextLine();
                    
                    
                    ad.add(n,s,t);
                    ad.showall();
                    break;
            
                case 2:
                    System.out.println("Which NO. you want to edit : ");
                    int num = input.nextInt();
                    input.nextLine();

                    System.out.println("Name : ");
                    String n2 = input.nextLine();
                    
                    System.out.println("SurName : ");
                    String s2 = input.nextLine();
                    
                    System.out.println("Tel : ");
                    String t2 = input.nextLine();
                    input.nextLine();

                    ad.edit(num , n2 , s2 , t2);
                    ad.showall();
                    break;

                case 3:
                    System.out.println("Which NO. you want to insert : ");
                    int in = input.nextInt();
                    input.nextLine();

                    System.out.println("Name : ");
                    String n3 = input.nextLine();
                    
                    System.out.println("SurName : ");
                    String s3 = input.nextLine();
                    
                    System.out.println("Tel : ");
                    String t3 = input.nextLine();
                    input.nextLine();

                    ad.insert(in,n3,s3,t3);
                    ad.showall();
                    break;

                case 4:
                    ad.sort();
                    ad.showall();

                    break;

                case 5:

                    System.out.println("Which NO. you want to delete : ");
                    int d1 = input.nextInt();
                    

                    for (int i = 0 ; i <1 ; i++){
                        System.out.print("\nYou want to delete ? : Yes =(1) , No =(0)");
                        int dicition = input.nextInt();
                        input.nextLine();

                        if (dicition == 1){
                            
                            int d2 = d1;
                            System.out.println("Confirm\n");
                            ad.delete(d2);
                            ad.showall();

                        }else if (dicition == 0){

                            System.out.println("\nCancel\n");

                        }else{
                            System.out.print("Please Enter Only : (1) , (0)\n");
                            i--;
                        }
                    }
                    break;

                case 0:
                    System.out.println("Closing the program... Good bye!");
                    break;
                    
                default:
                    System.out.println("Invalid option! Please try again.");
                    break;

            }
            
        } while ( c != 0);

        
        input.close();
    }
}
