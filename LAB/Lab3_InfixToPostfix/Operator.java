package LAB.Lab3_InfixToPostfix;

public class Operator {

     int stackPrecedence(char symbol){
        switch(symbol){//เลขสูงคคือดีกว่าอิงตามเอกสาร
            case '^' :
                return 3;
            case '*' :
            case '/' :
            case '%' :
                return 2;
            case '+' :
            case '-' :
                return 1;
            case '(' :
                return 0; // สำหรับวงเล็บเปิด ให้ความสำคัญต่ำสุด
            default :
                return -1; // ความสำคัญต่ำสุด
        }   
    }
    
    int incomingPrecedence(char symbol){
        switch(symbol){
            case '^' : 
                return 4;
            case '*' : 
            case '/' : 
            case '%' : 
                return 2;
            case '+' : 
            case '-' : 
                return 1;
            case '(' : 
                return 4;
            default : 
            return -1;
        }   
    }
}

