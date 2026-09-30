package LAB.stockfileInfixToPostfix;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        ValidationInfix validator = new ValidationInfix();
        Infixtopostfix converter = new Infixtopostfix();
        Calculate calculator = new Calculate();
        
        System.out.print("Enter Infix Expression: ");
        String input = scanner.nextLine(); // ตัวอย่างเช่น: 2(5+3)
        
        String status = validator.setValidate(input);
        
        if (status.equals("SUCCESS")) {
            String validExpression = validator.getValidate();
            System.out.println("Valid Expression: " + validExpression); // จะออกมาเป็น: 2*(5+3)
            
            System.out.println("\n--- Step-by-Step Conversion ---");
            String postfixResult = converter.inToPostFix(validExpression);
            
            System.out.println("\nPostfix Output : " + postfixResult);
            
            // นำผลลัพธ์ Postfix ไปคำนวณ
            try {
                double finalAnswer = calculator.evaluatePostfix(postfixResult);
                System.out.println("Final Answer   : " + finalAnswer);
            } catch (Exception e) {
                System.out.println("Calculation Error: " + e.getMessage());
            }
            
        } else {
            System.out.println(status);
        }
        
        scanner.close();
    }
}