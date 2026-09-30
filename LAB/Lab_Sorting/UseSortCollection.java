package LAB.Lab_Sorting;

public class UseSortCollection { // RandomData + SortCollection + TimeTracker

    public static void runBenchmarkTable(int[] sizes, long seed) {
        runBenchmark(sizes, seed);
    }
    public static void runBenchmark(int[] sizes, long seed) {
        SortCollection sort = new SortCollection();
        TimeTracker time = new TimeTracker();

        System.out.println("กำลังทดสอบ Benchmark กรุณารอซักครู่");
        System.out.println("----(Please wait a moment)----");
        
        System.out.println("========================================================================================");
        System.out.printf("| %-10s | %-15s | %-16s | %-16s | %-14s |\n", "Data\\Sort", "Bubble (ms)", "Selection (ms)",
                "Insertion (ms)", "Quick (ms)");
        System.out.println("----------------------------------------------------------------------------------------");

        double bestScore = 0;//ไม่เกี่ยวข้องกับตัวcodeหลักเป็นส่วนของUI
        int maxN = 0;//ไม่เกี่ยวข้องกับตัวcodeหลักเป็นส่วนของUI

        for (int n : sizes) {
            int[] ori = RandomData.generateRandomData(n, seed);

            // 1. Bubble Sort
            int[] bubble = ori.clone();
            time.start();
            sort.bubbleSort(bubble);
            double timeBubble = time.getTimeToMillisec();

            // 2. Selection Sort
            int[] selection = ori.clone();
            time.start();
            sort.selectionSort(selection);
            double timeSelection = time.getTimeToMillisec();

            // 3. Insertion Sort
            int[] insert = ori.clone();
            time.start();
            sort.insertionSort(insert);
            double timeInsertion = time.getTimeToMillisec();

            // 4. Quick Sort
            int[] quick = ori.clone();
            time.start();
            sort.quickSort(quick);
            double timeQuick = time.getTimeToMillisec();

            System.out.printf("| %-10s | %-15.4f | %-16.4f | %-16.4f | %-14.4f |\n",
                    String.format("%,d", n), timeBubble, timeSelection, timeInsertion, timeQuick);
            
            if (n > maxN) {
                maxN = n;
                bestScore = timeQuick;
            }
        }

        System.out.println("========================================================================================");
        
        // Save the best score to ranks.js automatically
        if (bestScore > 0) {
            SystemInfoFetcher.saveRankToFile(bestScore);
        }
    }

    // สำหรับเรียกแบบขนาดเดียว
    public static void runBenchmark(int n, long seed) {
        runBenchmark(new int[] { n }, seed);
    }
}
