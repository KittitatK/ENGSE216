package LAB.Lab1_Phonebook.PhonebookFix;
import java.util.Scanner;

//เรียกใช้
public class Main {

    public static void main(String[] phonebook){

        phoneBook pb = new phoneBook();
        Scanner input =  new Scanner(System.in);
        String c = new String();
        int con = 1;

        pb.setList();

        do {
            System.out.println("\nadd         edit ");
            System.out.println("insert      sort ");
            System.out.println("delete      end\n");

            System.out.print(">> ");
            c = input.nextLine();
            
            String lowtext = c.toLowerCase(); //แปลงเป็นตัวเล็ก
                
            switch (lowtext) {

                case "add":

                    pb.add();
                        
                    break;

                case "edit":

                    pb.edit();
                    
                    break;

                case "insert":

                    pb.insert();

                    break;
            
                case "sort":
                    
                    pb.sort();
                    
                    break;

                case "delete":

                    pb.delete();
                    
                    break;

                case "end":
                        con = 0;
                        System.out.println("Closing the program... Good bye!");
                    break;

                default:
                    System.out.println("Error: Invalid command. Please enter a valid menu option.");
                    break;
            }
            
        } while (con != 0);

        
    }
    
}


