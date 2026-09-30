package LAB.Lab_Sorting;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;

public class SystemInfoFetcher {

    public static String[] fetchSystemSpecs() {
        String cpu = "Unknown CPU";
        String ram = "Unknown RAM";
        try {
            String os = System.getProperty("os.name").toLowerCase();
            if (os.contains("win")) {
                Process p = Runtime.getRuntime().exec("powershell.exe -Command \"(Get-CimInstance Win32_Processor).Name\"");
                p.waitFor();
                BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String c = reader.readLine();
                if (c != null && !c.trim().isEmpty()) cpu = c.trim();
                
                p = Runtime.getRuntime().exec("powershell.exe -Command \"[math]::Round((Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum / 1GB)\"");
                p.waitFor();
                reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String r = reader.readLine();
                if (r != null && !r.trim().isEmpty()) ram = r.trim() + " GB";
            }
        } catch (Exception e) {
            // Ignored
        }
        return new String[] { cpu, ram };
    }

    public static void printSystemInfo() {
        String[] specs = fetchSystemSpecs();
        System.out.println("[SYSTEM_INFO]");
        System.out.println("CPU: " + specs[0]);
        System.out.println("RAM: " + specs[1]);
        System.out.println("[END_SYSTEM_INFO]");
        System.out.println("");
    }

    public static void saveRankToFile(double score) {
        try {
            String[] specs = fetchSystemSpecs();
            String userName = System.getProperty("user.name") + "'s PC";
            
            String newEntry = "    {\n" +
                              "        name: \"" + userName + "\",\n" +
                              "        cpu: \"" + specs[0] + "\",\n" +
                              "        ram: \"" + specs[1] + "\",\n" +
                              "        score: " + score + "\n" +
                              "    },";

            // Relative path assuming execution from workspace root
            String filePath = "LAB/Lab_Sorting/Graph/ranks.js";
            File f = new File(filePath);
            if (!f.exists()) {
                // Fallback to absolute path just in case
                filePath = "e:/ENGSE216/LAB/Lab_Sorting/Graph/ranks.js";
                f = new File(filePath);
            }
            if (!f.exists()) {
                System.out.println("⚠️ Could not find ranks.js to save the score.");
                return;
            }

            String content = new String(Files.readAllBytes(Paths.get(filePath)));
            
            // Regex to find and remove all existing entries for this user
            String safeUserName = java.util.regex.Pattern.quote(userName);
            String regex = "(?s)\\s*\\{\\s*name:\\s*\"" + safeUserName + "\".*?\\},?";
            
            boolean existed = content.matches("(?s).*" + regex + ".*");
            content = content.replaceAll(regex, "");
            
            // Insert the fresh entry at the top of the array
            content = content.replaceFirst("const MACHINE_RANKS = \\[", "const MACHINE_RANKS = [\n" + newEntry);
            
            Files.write(Paths.get(filePath), content.getBytes());
            
            if (existed) {
                System.out.println("✅ Successfully updated your existing rank in ranks.js!");
            } else {
                System.out.println("✅ Successfully saved your new rank permanently to ranks.js!");
            }

        } catch (Exception e) {
            System.out.println("⚠️ Error saving rank to file: " + e.getMessage());
        }
    }
}
