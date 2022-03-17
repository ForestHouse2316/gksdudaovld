package gksdudaovld;

import java.util.*;

public class KoEngMapper {
    public static final ArrayList<String> KO_TOP = new ArrayList<>(Arrays.asList("ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"));
    public static final ArrayList<String> KO_MID = new ArrayList<>(Arrays.asList("ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"));
    public static final ArrayList<String> KO_BOT = new ArrayList<>(Arrays.asList("", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"));

    public static final ArrayList<String> KO_TOP_EN = new ArrayList<>(Arrays.asList("r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g"));
    public static final ArrayList<String> KO_MID_EN = new ArrayList<>(Arrays.asList("k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"));
    public static final ArrayList<String> KO_BOT_EN = new ArrayList<>(Arrays.asList("", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"));
    public static final String[] EN_LOWER_ONLY = new String[]{"A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "S", "U", "V", "X", "Y", "Z"}; // TODO Change to EN_UPPERS to reduce processing

    // raw_mapper starts on (hex)12593
    public static final ArrayList<String> RAW_MAPPER = new ArrayList<>(Arrays.asList("r", "R", "rt", "s", "sw", "sg", "e", "E", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "Q", "qt", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g", "k", "o", "i", "O","j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"));

    public static List<String[]> splitEn(StringBuilder string) {
        StringBuilder stringBuilder = new StringBuilder();
        for (String c : EN_LOWER_ONLY) {
            string.replace(0, string.length(), string.toString().replace(c, c.toLowerCase()));
        }

        int jump = 0;
        List<String[]> separated = new ArrayList<>();
        char[] stringArr = string.toString().toCharArray();
        for (int i = 0; i < stringArr.length; i++) {
            char currentChar = stringArr[i];
            int shift = 0;
            // TODO change this to integer to make process faster
            StringBuilder combination = new StringBuilder().append('t');
            if (jump > 0) {
                jump -= 1;
                continue;
            } else if (currentChar == ' ' || Character.isDigit(currentChar) || !Character.isLetter(currentChar)) {
                separated.add(new String[]{String.valueOf(currentChar)});
                continue;
            } else {
                try {
                    if (isAttachable(stringArr[i + shift], stringArr[i + shift + 1]) == 2) { // 자 + 모
                        shift++;
                        combination.append('m');
                        if (isAttachable(stringArr[i + shift], stringArr[i + shift + 1]) == 3) { // 모 + 모
                            shift++;
                            combination.append('m');
                        }
                        if (isAttachable(stringArr[i + shift], stringArr[i + shift + 1]) == 4) { // 모 + 자
                            shift++;
                            int finalAttachment = isAttachable(stringArr[i + shift], stringArr[i + shift + 1]);
                            switch (finalAttachment) {
                                case 5: // 자 + 자 (종)
                                    combination.append("bb");
                                    break;
                                case 2: // 자 + 모 (다음)
                                    break;
                                default: // 단받침 / 자 + 자 (다음)
                                    combination.append('b');
                            }
                        }
                    }
                } catch (Exception ignored) {
                }
            }
            switch (combination.toString()) {
                case "t" -> separated.add(new String[]{String.valueOf(stringArr[i])});
                case "tm" -> separated.add(new String[]{String.valueOf(stringArr[i]), String.valueOf(stringArr[i + 1])});
                case "tmm" -> separated.add(new String[]{String.valueOf(stringArr[i]),
                        String.valueOf(stringArr[i + 1] + stringArr[i + 2])});
                case "tmb" -> separated.add(new String[]{String.valueOf(stringArr[i]),
                        String.valueOf(stringArr[i + 1]), String.valueOf(stringArr[i + 2])});
                case "tmmb" -> separated.add(new String[]{String.valueOf(stringArr[i]),
                        String.valueOf(stringArr[i + 1] + stringArr[i + 2]), String.valueOf(stringArr[i + 2])});
                case "tmmbb" -> separated.add(new String[]{String.valueOf(stringArr[i]),
                        String.valueOf(stringArr[i + 1] + stringArr[i + 2]),
                        String.valueOf(stringArr[i + 3] + stringArr[i + 4])});
            }
            jump = combination.length() - 1;
        }
        return separated;
    }


    static int isAttachable(char i, char l) {
        if (KO_TOP_EN.contains(String.valueOf(i)) && KO_MID_EN.contains(String.valueOf(l))) {return 2;}
        else if (KO_MID_EN.contains(String.valueOf(i) + l)) {return 3;}
        else if (KO_MID_EN.contains(String.valueOf(i)) && KO_BOT_EN.contains(String.valueOf(l))) {return 4;}
        else if (KO_BOT_EN.contains(String.valueOf(i) + l)) {return 5;}
        else {return 0;}
    }


}
