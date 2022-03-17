import gksdudaovld.KoEngMapper;

import java.util.List;
import java.util.Scanner;

public class MapperTest {
    public static void main(String[] args) {
        while (true) {
            Scanner sc = new Scanner(System.in);
            String input = sc.nextLine();
            if (input.equals("exit")) {
                sc.close();
                break;
            }
            List<String[]> value = KoEngMapper.splitEn(new StringBuilder(input));
            for (String[] capsule: value) {
                for (String bit: capsule) {
                    System.out.print(bit);
                }
                System.out.print("/");
            }
        }
    }
}
