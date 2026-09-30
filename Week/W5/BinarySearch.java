package Week.W5;

import java.util.Scanner;

public class BinarySearch {

    public static void main(String[] args){
        BST bs = new BST();
        Scanner input = new Scanner(System.in);
        int i = 0;
        
        System.out.println("Please enter 10 numbers to build the Binary Search Tree:");
        do {
            System.out.print("Enter number " + (bs.cnode + 1) + ": ");
            i = input.nextInt();
            bs.buildTree(bs.root, i, 0); // เรียกใช้งาน buildTree เพื่อเพิ่ม Node ใหม่
        } while (bs.cnode < 10);

        System.out.println("Tree built successfully with 10 nodes.");
        input.close();
    }
    
}
