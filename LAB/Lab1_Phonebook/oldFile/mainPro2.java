package LAB.Lab1_Phonebook;


public class mainPro2 {
    
    public static void main(String[] args){

        list ad = new list();

        System.out.println("\nTest Add\n");

        ad.add("Somchai", "Jaidee", "061-0008581");
        ad.add("Somsri", "Rakthai", "082-2222222");
        ad.add("Anan", "Sukjai", "083-3333333");
        ad.add("Boonmee", "Meechok", "084-4444444");
        ad.add("Chaiyo", "Yindee", "085-5555555");
        
 

        ad.showall();

        System.out.println("\nTest Delete\n");

        System.out.println("> ลบข้อมูลตำแหน่งที่ 2");
        ad.delete(2); 
        System.out.println("> ลบข้อมูลตำแหน่งที่ 5");
        ad.delete(5); 
        
        ad.showall();

        System.out.println("\nTest Edit\n");

        ad.edit(0, "Somchai_Edit", "NewLastName1", "091-1111111");
        ad.edit(1, "Somsri_Edit", "NewLastName2", "092-2222222");
        ad.edit(3, "Chaiyo_Edit", "NewLastName3", "093-3333333");
        
        ad.showall();

        System.out.println("\nTest Insert\n");

        ad.insert(1, "Insert_Man1", "InSurn1", "071-1111111");
        ad.insert(3, "Insert_Man2", "InSurn2", "072-2222222");
        ad.insert(5, "Insert_Man3", "InSurn3", "073-3333333");
        
        ad.showall();

        System.out.println("\nTest Sorting\n");
        ad.sort();
        ad.showall();
    }
    
}
