package LAB.Lab3_InfixToPostfix;

public class Infixtopostfix {
    
    LinkedListStack stack = new LinkedListStack();
    Operator p = new Operator();
    String numStr = ""; 

    public String inToPostFix(String expression){
        
        int i = 0 ;
        char symbol,next;

        StringBuilder postfix = new StringBuilder();

        char[] infix = expression.toCharArray();

        System.out.println("-------------------------------------------------------------");//สร้างช่องตาราง
        System.out.printf("%-10s | %-30s | %-15s |\n", "I/P (Input)", "O/P (Postfix)", "Stack");
        System.out.println("-------------------------------------------------------------");
        
        for (i = 0 ; i < infix.length ; i++){
            symbol = infix[i];
            String printSym = String.valueOf(symbol); // แปลงเป็น String เ
            boolean shouldPrint = true;
            
            switch(symbol){
                case '(' ://เมื่อเป็น operator () ,+ ,- ,* ,/ ,^ or **
                    stack.push(symbol);
                    break;
                case ')' :
                    while (!stack.isEmpty() && (next = stack.pop()) != '('){
                        postfix.append(next).append(" ");
                    }
                    break;
                case '+' :
                case '-' :
                case '*' :
                case '%' :
                case '/' :
                case '^' :
                    while (!stack.isEmpty() && p.stackPrecedence(stack.peek()) >= p.incomingPrecedence(symbol)) {
                        postfix.append(stack.pop()).append(" ");
                    }
                    stack.push(symbol);

                    break;
                default ://ไม่ใช่ operator นำค่าไป push 
                    if (symbol != ' '){
                        numStr += symbol; // สะสมตัวเลข (เช่น '1' + '0' = "10")
                        postfix.append(symbol);

                        if (i == infix.length - 1 || (!Character.isDigit(infix[i+1]) && infix[i+1] != '.')) {//ตรวจถึงตัวสุดท้ายและหากมี.ก็จะใส่หากไม่มี ก็จะเว้นช่องและรันตัวถัดๆไป
                            postfix.append(" ");
                            printSym = numStr; 
                            numStr = "";     
                        } else {
                            shouldPrint = false; 

                        }
                    } else {
                        shouldPrint = false; 
                    }
            }

        
            if (shouldPrint) {
                System.out.printf("%-10s | %-30s | %-15s |\n", printSym, postfix.toString(), stack.displayStack());
            }

        }
        while (!stack.isEmpty()){// เอาไว้กันช่องว่างข้างหลังสุดท้าย
            postfix.append(stack.pop()).append(" ");
            System.out.printf("%-10s | %-30s | %-15s |\n", "null"  , postfix.toString(), stack.displayStack()); 
        }

        System.out.println("-------------------------------------------------------------");

           return postfix.toString().trim();
    }
}
