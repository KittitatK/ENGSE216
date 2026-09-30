package Week.W4.Singly_Linked_Lists;

public class SLinkedList {
    int count;
    Node head , tail , travel;

    void addFirst(int item){
        if(count==0){
            add(item);
        }else{
            Node nn = new Node(item);
            nn.link = head;
            head = nn;
            count++;
        }

    }

    void add (int item){
        Node nn = new Node(item);
            //nn.info = item;
           
        if (count==0){
            head = nn;
            tail = nn;
        }else{
            tail.link = nn;
            tail = nn;
        }
        count++;
    }

    void showAll(){
        travel = head;
        for(int i = 0 ; i < count ; i++){
            System.out.println(travel.info + " ");
            travel = travel.link;
        }
        System.out.println("--------------------");

    }
}
