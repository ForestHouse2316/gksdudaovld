class KoEngMapper:
    """
    Mapping module for conversion between Korean and English

    Made by ForestHouse

    GitHub Repo : https://github.com/ForestHouse2316/gksdudaovld
    """

    """
    Constants

    ko_pos - Korean characters' indexes
    ko_pos_en - English characters' indexes based on the Korean characters' position in QWERTY keyboard.
    en_lower_only - Upper cases that doesn't have any shifted Korean character in QWERTY keyboard.
    raw_mapper - English characters' indexes based on the Korean characters' unicode number.
    """
    ko_top = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]  # 18
    ko_mid = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ",
              "ㅣ"]  # 21
    ko_bot = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ",
              "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]  # 28

    ko_top_en = ["r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g"]
    ko_mid_en = ["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m",
                 "ml", "l"]
    ko_bot_en = ["", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q",
                 "qt", "t", "T",
                 "d", "w", "c", "z", "x", "v", "g"]
    en_lower_only = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "S", "U", "V", "X", "Y", "Z"]

    # raw_mapper starts on (hex)12593
    raw_mapper = ["r", "R", "rt", "s", "sw", "sg", "e", "E", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q",
                  "Q", "qt", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g", "k", "o", "i", "O", "j", "p", "u", "P",
                  "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"]

    @classmethod
    def split_en(cls, string):
        """
        split_en(string)

        Split English words based on Korean.
        Return a list containing groups that have a set of Korean.
        For example, ['r', 'k'] for '가', ['a', 'o', 'q'] for '맵'.
        And following this rule, each group means one character in Korean.
        If character is not an English, that'll be put in the list without any processing.

        :returns: [[top, mid, bot], ..., [top, mid, bot]]
        """
        for c in KoEngMapper.en_lower_only:
            string = string.replace(c, c.lower())
        jump = 0
        separated = []
        for capsule in enumerate(string):
            shift = 0
            combination = "t"
            current_idx = None
            if jump:
                jump -= 1
                continue
            elif capsule[1] == " " or capsule[1].isdigit() or (not capsule[1].isalpha()):
                separated.append(capsule[1])
                continue
            else:
                try:
                    current_idx = capsule[0]

                    if cls.is_attach_available(string[current_idx + shift], string[current_idx + shift + 1]) == 2:  # 자 + 모
                        shift += 1
                        combination += 'm'
                        if cls.is_attach_available(string[current_idx + shift],
                                               string[current_idx + shift + 1]) == 3:  # 모 + 모
                            shift += 1
                            combination += 'm'
                        if cls.is_attach_available(string[current_idx + shift],
                                               string[current_idx + shift + 1]) == 4:  # 모 + 자
                            shift += 1
                            attachment3 = cls.is_attach_available(string[current_idx + shift],
                                                              string[current_idx + shift + 1])
                            if attachment3 == 5:  # 자 + 자 (종)
                                combination += 'bb'
                            elif attachment3 == 2:  # 자 + 모 (다음)
                                pass
                            else:  # 단받침 / 자 + 자 (다음)
                                combination += 'b'
                except:
                    pass
            if combination == "t":
                separated.append((string[current_idx]))
            elif combination == "tm":
                separated.append((string[current_idx], string[current_idx + 1]))
            elif combination == "tmm":
                separated.append((string[current_idx], string[current_idx + 1: current_idx + 4]))
            elif combination == "tmb":
                separated.append((string[current_idx], string[current_idx + 1], string[current_idx + 2]))
            elif combination == "tmmb":
                separated.append(
                    (string[current_idx], string[current_idx + 1: current_idx + 3], string[current_idx + 3]))
            elif combination == "tmbb":
                separated.append(
                    (string[current_idx], string[current_idx + 1], string[current_idx + 2: current_idx + 4]))
            elif combination == "tmmbb":
                separated.append((string[current_idx], string[current_idx + 1: current_idx + 3],
                                  string[current_idx + 3: current_idx + 5]))
            jump = len(combination) - 1
        return separated

    @staticmethod
    def split_ko(string):
        """
        split_ko(string)

        Disassemble Korean character.
        In Korean, up to three Korean characters can be assembled into one character.
        This method disassembles it, convert them to an index number of QWERTY keyboard map list, and finally put them into the list.
        If there is no final consonant, "" will be inserted instead. (its index number is 0)
        For example, "가" -> [0, 0, 0], "맵" -> [4, 1, 17]

        :return: [[top_idx, mid_idx, bot_idx], ..., [top_idx, mid_idx, bot_idx]]
        """
        separated = []
        for c in string:
            if c == " ":
                separated.append((" "))
                continue
            hexcode = ord(c)
            if hexcode >= 44032:
                hex_zeropoint = (hexcode - 44032)
                top_idx = hex_zeropoint // 28 // 21
                mid_idx = hex_zeropoint // 28 % 21
                bot_idx = hex_zeropoint % 28

                separated.append((top_idx, mid_idx, bot_idx))
            else:  # 12593~12643
                separated.append([hexcode])

        return separated

    @staticmethod
    def is_attach_available(i, l):
        """
        is_attach_available(former, latter)

        Check the attach-ability for those two parameters.

        :return: First Consonant + First Consonant => 1 (Not used)
        First Consonant + Vowel => 2
        Vowel + Vowel => 3
        Vowel + Final Consonant => 4
        Final Consonant + Final Consonant => 5
        """
        # 자 + 자 (초) (대문자로 표현)
        # if i+l in ko_mid_en:
        #     return 1
        # 자 + 모
        if i in KoEngMapper.ko_top_en and l in KoEngMapper.ko_mid_en:
            return 2
        # 모 + 모
        if i + l in KoEngMapper.ko_mid_en:
            return 3
        # 모 + 자
        if i in KoEngMapper.ko_mid_en and l in KoEngMapper.ko_bot_en:
            return 4
        # 자 + 자 (종)
        if i + l in KoEngMapper.ko_bot_en:
            return 5
        return 0

    @staticmethod
    def conv_en2ko(string):
        """
        conv_en2ko(string)

        Convert English characters to Korean characters.

        :return: String (Korean)
        """
        char_groups = KoEngMapper.split_en(string)
        converted_string = ''
        for char_group in char_groups:
            top_idx = 0
            mid_idx = 0
            bot_idx = 0
            for char_capsule in enumerate(char_group):
                if char_capsule[1] == " " or char_capsule[1].isdigit() or (not char_capsule[1].encode().isalpha()):
                    converted_string += char_capsule[1]
                    break
                if char_capsule[0] == 0:
                    top_idx = KoEngMapper.ko_top_en.index(char_capsule[1])
                elif char_capsule[0] == 1:
                    mid_idx = KoEngMapper.ko_mid_en.index(char_capsule[1])
                elif char_capsule[0] == 2:
                    bot_idx = KoEngMapper.ko_bot_en.index(char_capsule[1])
            else:
                converted_string += chr((top_idx * 21 * 28 + mid_idx * 28 + bot_idx) + 44032)
        return converted_string

    @staticmethod
    def conv_ko2en(string):
        """
        conv_ko2en(string)

        Convert Korean characters to English characters.

        :return: String (English)
        """
        idx_groups = KoEngMapper.split_ko(string)
        converted_string = ''
        for idx_group in idx_groups:
            for idx_capsule in enumerate(idx_group):
                if idx_capsule[1] == " " or 12593 <= ord(idx_capsule[1]) <= 12643:  # ㄱ ~ ㅣ
                    converted_string += idx_capsule[1]
                    continue
                elif idx_capsule[1] >= 12593:
                    converted_string += KoEngMapper.raw_mapper[idx_capsule[1] - 12593]
                    continue
                if idx_capsule[0] == 0:
                    converted_string += KoEngMapper.ko_top_en[idx_capsule[1]]
                elif idx_capsule[0] == 1:
                    converted_string += KoEngMapper.ko_mid_en[idx_capsule[1]]
                elif idx_capsule[0] == 2:
                    converted_string += KoEngMapper.ko_bot_en[idx_capsule[1]]
        return converted_string

    @staticmethod
    def print_bits(bit_groups):
        """
        print_bits(bit_groups)

        Print characters separated by the split method.
        """
        for bit_group in bit_groups:
            for bit in bit_group:
                print(bit, end='')