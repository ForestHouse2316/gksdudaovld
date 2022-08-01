/**
 * Constants
 * 
 * KO_POS - Korean characters' indexes
 * KO_POS_EN - English characters' indexes based on the Korean characters' position in QWERTY keyboard.
 * EN_LOWER_ONLY - Upper cases that doesn't have any shifted Korean character in QWERTY keyboard.
 * RAW_MAPPER - English characters' indexes based on the Korean characters' unicode number.
 * T / M / B - Filters to express combination of Korean characters
 */

const KO_TOP = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]; // 18
const KO_MID = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]; // 21
const KO_BOT = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]; // 28K
const KO_TOP_EN = ["r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g"];
const KO_MID_EN = ["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"];
const KO_BOT_EN = ["", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"];
const EN_LOWER_ONLY = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "S", "U", "V", "X", "Y", "Z"];

// raw_mapper starts on (hex)12593
const RAW_MAPPER = ["r", "R", "rt", "s", "sw", "sg", "e", "E", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "Q", "qt", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g", "k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"];

const KO_CHAR_START = 12593;
const KO_CHAR_END = 12643;
const KO_WORD_START = 44032;

const T = 0b00010000;
const M = 0b00000100;
const B = 0b00000001;
const TM = T + M;
const MM = M + M;
const MB = M + B;
const BB = B + B;
const TMM = T + M + M;
const TMB = T + M + B;
const TMMB = T + M + M + B;
const TMBB = T + M + B + B;
const TMMBB = T + M + M + B + B;

/**
 * 
 * @param {number} bin
 * @returns Return the Korean character's length in the view of english character. (e.g. T -> 1, TMMBB -> 5)
 */
const combLen = (bin) => {
    const getBit = (idx) => (bin >> (idx - 1)) & 1;
    return getBit(1) + getBit(3) + getBit(5) + 2 * (getBit(2) + getBit(4));
};
const isAlpha = (c) => /^[a-zA-Z]*$/.test(c); // strict alphabet checking
const isDigit = (c) => /^[0-9]*$/.test(c);

/**
 *  Split English words based on Korean.
 * Return a list containing groups that have a set of Korean.
 * For example, ['r', 'k'] for '가', ['a', 'o', 'q'] for '맵'.
 * And following this rule, each group means one character in Korean.
 * If character is not an English, that'll be put in the list without any processing.
 * @param {string} string 
 * @returns [[top, mid, bot], 'Korean', 'number', 'symbols', ... , [top, mid, bot]]
 */
export const splitEn = (string) => {
    for (const c in EN_LOWER_ONLY) {
        string = string.replace(c, c.toLowerCase());
    }
    let jump = 0;
    let separated = [];
    for (let i = 0; i < string.length; i++) {
        const capsule = [i, string.charAt(i)];
        let shift = 0;
        let combination = T;
        let currentIdx = null;
        if (jump) {
            jump -= 1;
            continue;
        } else if (!isAlpha(capsule[1])) {
            separated.push(capsule[1]);
            continue;
        } else {
            try {
                currentIdx = capsule[0];

                if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == TM) {
                    // 자 + 모
                    shift += 1;
                    combination += M;

                    if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == MM) {
                        // 모 + 모
                        shift += 1;
                        combination += M;
                    }
                    if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == MB) {
                        // 모 + 자
                        shift += 1;
                        combination += B;
                        let attachment3 = isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]);

                        if (attachment3 == BB) {
                            // 자 + 자 (종) + ?
                            if (currentIdx + shift + 2 == string.length) {
                                // IndexOutOfRange can be thrown
                                combination += B;
                            } else {
                                shift += 1;
                                let attachment4 = isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]);

                                if (attachment4 == TM) {
                                    // 자 + 자 + 모
                                    // pass
                                } else {
                                    // 자 + 자 + 자 (다음)
                                    combination += B;
                                }
                            }
                        } else if (attachment3 == TM) {
                            // 자 + 모 (다음)
                            combination -= B; // Remove 'B'
                        } else {
                            // 단받침 / 자 + 자 (다음)
                            // pass
                        }
                    }
                }
            } catch (IndexOutOfRange) {
                // pass
            }
        }
        switch (combination) {
            case T:
                separated.push([string[currentIdx]]);
                break;
            case TM:
                separated.push([string[currentIdx], string[currentIdx + 1]]);
                break;
            case TMM:
                separated.push([string[currentIdx], string[currentIdx + 1] + string[currentIdx + 2]]);
                break;
            case TMB:
                separated.push([string[currentIdx], string[currentIdx + 1], string[currentIdx+ 2]]);
                break;
            case TMMB:
                separated.push([string[currentIdx], string[currentIdx + 1] + string[currentIdx + 2], string[currentIdx + 3]]);
                break;
            case TMBB:
                separated.push([string[currentIdx], string[currentIdx + 1], string[currentIdx+ 2] + string[currentIdx+ 3]]);
                break;
            case TMMBB:
                separated.push([string[currentIdx], string[currentIdx + 1] + string[currentIdx + 2], string[currentIdx + 3] + string[currentIdx + 4]]);
                break;
        }
        jump = combLen(combination) - 1;
    }
    return separated;
};
/**
 * Disassemble Korean character.
 * In Korean, up to three Korean characters can be assembled into one character.
 * This method disassembles it, convert them to an index number of QWERTY keyboard map list, and finally put them into the list.
 * If there is no final consonant, "" will be inserted instead. (its index number is 0)
 * For example, "가" -> [0, 0, 0], "맵" -> [4, 1, 17]
 * @param {string} string 
 * @returns [[topIdx, midIdx, botIdx], 'English', 'number', 'symbol', ... , [topIdx, midIdx, botIdx]]
 */
export const splitKo = (string) => {
    let separated = [];
    for (let i = 0; i < string.length; i++) {
        let c = string.charAt(i);
        if (c === " ") {
            separated.push(" ");
            continue;
        }
        let hexcode = c.charCodeAt(0);
        if (hexcode >= KO_WORD_START) {
            let hexZeropoint = hexcode - KO_WORD_START;
            let topIdx = parseInt(hexZeropoint / 28 / 21);
            let midIdx = parseInt((hexZeropoint / 28) % 21);
            let botIdx = parseInt(hexZeropoint % 28);

            separated.push([topIdx, midIdx, botIdx]);
        } else if (KO_CHAR_START <= hexcode && hexcode <= KO_CHAR_END) {
            separated.push([hexcode]);
        } else {
            separated.push(c);
        }
    }
    return separated;
};
/**
 * Convert English characters to Korean characters.
 * @param {string} string 
 * @returns String (Korean)
 */
export const convEn2Ko = (string) => {
    let charGroups = splitEn(string);
    let convertedString = "";
    for (let charGroup of charGroups) {
        let topIdx = 0;
        let midIdx = 0;
        let botIdx = 0;
        let breaked = false;
        for (let i = 0; i < charGroup.length; i++) {
            let charCapsule = [i, charGroup[i]];
            if (charCapsule[1] === " " || isDigit(charCapsule[1]) || !isAlpha(charCapsule[1])) {
                convertedString += charCapsule[1];
                breaked = true;
                break;
            }
            if (charGroup.length == 1) {
                convertedString += String.fromCharCode(RAW_MAPPER.indexOf(charCapsule[1]) + KO_CHAR_START);
                breaked = true;
                break;
            }
            switch (charCapsule[0]) {
                case 0:
                    topIdx = KO_TOP_EN.indexOf(charCapsule[1]);
                    break;
                case 1:
                    midIdx = KO_MID_EN.indexOf(charCapsule[1]);
                    break;
                case 2:
                    botIdx = KO_BOT_EN.indexOf(charCapsule[1]);
                    break;
            }
        }
        if (!breaked) {
            convertedString += String.fromCharCode(topIdx * 21 * 28 + midIdx * 28 + botIdx + KO_WORD_START);
        }
    }
    return convertedString;
};


/**
 * Convert Korean characters to English characters.
 * @param {string} string 
 * @returns String (English)
 */
export const convKo2En = (string) => {
    let idxGroups = splitKo(string);
    let convertedString = "";
    for (let idxGroup of idxGroups) {
        for (let i = 0; i < idxGroup.length; i++) {
            let idxCapsule = [i, idxGroup[i]];
            if (typeof idxCapsule[1] != "number") {
                convertedString += idxCapsule[1];
                continue;
            } else if (KO_CHAR_START <= idxCapsule[1] && idxCapsule[1] <= KO_CHAR_END) {
                convertedString += RAW_MAPPER[idxCapsule[1] - KO_CHAR_START];
                continue;
            }
            switch (idxCapsule[0]) {
                case 0:
                    convertedString += KO_TOP_EN[idxCapsule[1]];
                    break;
                case 1:
                    convertedString += KO_MID_EN[idxCapsule[1]];
                    break;
                case 2:
                    convertedString += KO_BOT_EN[idxCapsule[1]];
                    break;
            }
        }
    }
    return convertedString;
};



/**
 * Check the attach-ability for those two parameters.
 * @param {string} i 
 * @param {string} l 
 * @returns Unattachable => false
 * 
 * First Consonant + First Consonant => 1 (Not used)
 * 
 * First Consonant + Vowel => 2
 * 
 * Vowel + Vowel => 3
 * 
 * Vowel + Final Consonant => 4
 * 
 * Final Consonant + Final Consonant => 5
 */
function isAttachable(i, l) {
    switch (true) {
        case KO_TOP_EN.indexOf(i) != -1 && KO_MID_EN.indexOf(l) != -1:
            return TM;
        case KO_MID_EN.indexOf(i + l) != -1:
            return MM;
        case KO_MID_EN.indexOf(i) != -1 && KO_BOT_EN.indexOf(l) != -1:
            return MB;
        case KO_BOT_EN.indexOf(i + l) != -1:
            return BB;
    }
    return false;
}

function print_bits(bitGroups) {
    for (const bitGroup in bitGroups) {
        for (bit in bitGroup) {
            print(bit);
        }
    }
}
