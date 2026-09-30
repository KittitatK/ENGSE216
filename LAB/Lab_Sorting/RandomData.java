package LAB.Lab_Sorting;

import java.util.Random;

public class RandomData {
    //500-100,000
     
    public static int[] generateRandomData(int n, long seed){//สุ่มเลขช่วง0-1,000,000 แบบมีseed(ข้อมูลชุดเดิมทุกครั้ง)
       
        Random rdnum = new Random(seed);
        int[] arrnum = new int[n];

        for (int i = 0; i < n; i++){
            arrnum[i] = rdnum.nextInt(1_000_000);
        }
        
        return arrnum;
    }


    
}
