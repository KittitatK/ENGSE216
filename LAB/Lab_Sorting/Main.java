package LAB.Lab_Sorting;

public class Main {
    //start program

    public static void main(String[] args) {
        long seed = 42L; // กำหนด seed เพื่อให้ผลนิ่ง
        
        //ทดสอบเวลาเรียงข้อมูล
        int[] sizes = {500, 1_000, 10_000, 50_000, 100_000};

        
        SystemInfoFetcher.printSystemInfo();

        UseSortCollection.runBenchmarkTable(sizes, seed);
    }
}
