package Week.W3.Stack;

public class UsedCollection {
    public static void main(String[] args){
        stack s = new stack(10);

        s.push(1);
        s.push(2);
        s.push(3);
        s.push(4);
        s.push(5);
        s.push(6);
     
        System.out.println(s.pop());
    }
}
