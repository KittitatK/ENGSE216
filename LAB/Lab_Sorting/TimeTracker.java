package LAB.Lab_Sorting;

public class TimeTracker {
    
    private long startTime;

    // เริ่มจับเวลา
    public void start() {
        this.startTime = System.nanoTime();
    }

    // คืนค่าระยะเวลาที่ผ่านไป (หน่วยเป็น ms)
    public double getTimeToMillisec() {
        long endTime = System.nanoTime();
        return (endTime - this.startTime) / 1_000_000.0;
    }
}
