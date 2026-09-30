package LAB.Lab3_InfixToPostfix;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        ValidationInfix validator = new ValidationInfix();
        Infixtopostfix converter = new Infixtopostfix();
        
        System.out.print("Enter Infix Expression: ");
        String input = scanner.nextLine();
        
        // 1. ตรวจสอบความถูกต้อง
        String status = validator.setValidate(input);
        
        if (status.equals("SUCCESS")) {
            // 2. ดึงสมการที่ผ่านการแปลง ** เป็น ^ เรียบร้อยแล้วมาใช้
            String validExpression = validator.getValidate();
            System.out.println("Valid Expression: " + validExpression);
            
            // 3. ทำการแปลงเป็น Postfix
            String result = converter.inToPostFix(validExpression);
            System.out.println("Postfix Output  : " + result);
            
        } else {
            // กรณีเกิด Error จาก Validation
            System.out.println(status);
        }

        
        scanner.close();
    }
}