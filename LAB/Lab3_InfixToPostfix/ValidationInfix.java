package LAB.Lab3_InfixToPostfix;

public class ValidationInfix {

    private String validate;

    public String setValidate(String input) {
        input = input.trim(); // ลบช่องว่างด้านหน้าและด้านหลังของสตริง
        if (input.isEmpty()) return "error : Input is empty";
        if (!input.matches("[0-9\\.\\+\\-\\*\\/\\^\\%\\(\\)\\s]+")) return "error : Can add only number and operators";

        

        char firstChar = input.charAt(0);
        if (firstChar == '.' || firstChar == '-') {//เมื่อมีจุดอยู่ด้านหน้า ให้เติม 0 ข้างหน้า(อิงตามหลักการในเครื่องคิดเลข)
            input = "0" + input;
        } else if (firstChar == '+' || firstChar == '*' || firstChar == '/' || firstChar == '^' || firstChar == '%') {
            return "error : invalid syntax"; 
        }


         this.validate = input.replace("**", "^"); //ให้ยกกำลัง ** == ^

         this.validate = input = input.replaceAll("([0-9\\)])\\s*\\(", "$1*(");
         this.validate = input = input.replaceAll("\\)\\s*([0-9])", ")*$1");
        
        
         String noSpace = this.validate.replace(" ", "");

        // [+\\-*/%^]{2,} หมายถึง มีเครื่องหมายเหล่านี้ติดกันตั้งแต่ 2 ตัวขึ้นไป
        if (noSpace.matches(".*[*/%^]{2,}.*")) {
            return "error : Operator can't put more than 1";
        }
        
        char lastChar = this.validate.charAt(this.validate.length() - 1);//เช็คตัวสุดท้ายว่ามี ตัวเลขไหม
        if (lastChar == '+' || lastChar == '-' || lastChar == '*' || 
            lastChar == '/' || lastChar == '%' || lastChar == '^'  ) {
            return "error : don't have operand";
        }

       return "SUCCESS";
    }
    
    public String getValidate() {
        return this.validate;
    }
}

