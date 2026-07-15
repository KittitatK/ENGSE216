package Week.W3.Stack;

public class stack {
    private int arr[];
    int top = -1;

    stack(){
        this(5);//Stack(5)
        
       //arr = new int[5];
    }
    stack(int size){
        arr = new int[size];
    }
    void push(int item){
        if(isfull()){
            System.out.println("Stack is full");
        }else{
            top++;
            arr[top] = item;
        }
        
    }

    int top(){
        int temp = 0;
        if(top<0){
            System.out.println("Stack is Empty.");
            temp = -1;
        }else{
            temp = arr[top];
        }
        return temp;
    }

    int size(){return top+1;}

    int pop(){
        int temp = -1;

        if(isempty()){
            System.out.println("Stack is Empty");
        }else{
            temp = arr[top];
            top--;
        }
            return temp;
        
        
    }


    boolean isempty(){return top <0;}
    boolean isfull(){ return top+1 == arr.length;}

}