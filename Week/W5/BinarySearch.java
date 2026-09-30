package Week.W5;

import java.util.Scanner;

public class BinarySearch {

    public static void main(String[] args){
        BST bs = new BST();
        Scanner input = new Scanner(System.in);
        bs.root = bs.sentinel;
        int i = 0;
        do{
            i = input.nextInt();
            bs.root = bs.sentinel;
        }while(bs.cnode != 10);

    }
    
}
