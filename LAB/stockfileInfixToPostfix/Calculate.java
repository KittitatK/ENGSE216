package LAB.stockfileInfixToPostfix;

public class Calculate {

    // สร้าง Node และ Stack สำหรับเก็บตัวเลขแบบ Double โดยเฉพาะ
    class DoubleNode {
        double data;
        DoubleNode link;
        DoubleNode(double data) {
            this.data = data;
            this.link = null;
        }
    }

    class DoubleStack {
        private DoubleNode head;

        public void push(double data) {
            DoubleNode n = new DoubleNode(data);
            n.link = head;
            head = n;
        }

        public double pop() {
            if (isEmpty()) throw new RuntimeException("Stack is empty");
            double popdata = head.data;
            head = head.link;
            return popdata;
        }

        public boolean isEmpty() {
            return head == null;
        }
    }

    // เมธอดหลักในการคำนวณ
    public double evaluatePostfix(String postfix) {
        DoubleStack stack = new DoubleStack();
        String[] tokens = postfix.split(" "); // แยกตัวเลขและเครื่องหมายด้วยเว้นวรรค

        for (String token : tokens) {
            if (token.isEmpty()) continue;

            if (isOperator(token)) {
                double val2 = stack.pop(); // ตัวตั้ง
                double val1 = stack.pop(); // ตัวกระทำ
                double result = applyOperator(token, val1, val2);
                stack.push(result);
            } else {
                // แปลงสตริงเป็นตัวเลขและเก็บลง Stack
                stack.push(Double.parseDouble(token));
            }
        }

        return stack.pop(); // ผลลัพธ์สุดท้าย
    }

    private boolean isOperator(String token) {
        return token.matches("[+\\-*/%^]");
    }

    private double applyOperator(String operator, double a, double b) {
        switch (operator) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": 
                if(b == 0) throw new ArithmeticException("Error: Cannot divide by zero.");
                return a / b;
            case "%": return a % b;
            case "^": return Math.pow(a, b);
            default: throw new IllegalArgumentException("Unknown operator");
        }
    }
}

