package Week.W5;

public class BST {
    BTNode sentinel = new BTNode();
    BTNode root;
    BTNode travel;
    int cnode = 0;

    public BST() {
        root = sentinel;
    }

    public void buildTree(BTNode t, int x, int flag) {
        if (t != sentinel) {
            travel = t;
            if (x < t.info) {
                flag = 1;
                buildTree(t.left, x, flag);
            } else {
                flag = 2;
                buildTree(t.right, x, flag);
            }
        } else {
            BTNode newNode = new BTNode();
            newNode.info = x;
            newNode.left = sentinel;
            newNode.right = sentinel;
            newNode.parent = travel; // Assign parent

            if (cnode == 0) {
                root = newNode;
                cnode++;
            } else if (flag == 1) {
                travel.left = newNode;
                cnode++;
            } else {
                travel.right = newNode;
                cnode++;
            }
        }
    }
}
