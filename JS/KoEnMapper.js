const KoTop = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]; // 18
const KoMid = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]; // 21
const KoBot = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]; // 28K
const KoTopEn = ["r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g"];
const KoMidEn = ["k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"];
const KoBotEn = ["", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g"];
const EnLowerOnly = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "S", "U", "V", "X", "Y", "Z"];

// raw_mapper starts on (hex)12593
const RawMapper = ["r", "R", "rt", "s", "sw", "sg", "e", "E", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "Q", "qt", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g", "k", "o", "i", "O", "j", "p", "u", "P", "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m", "ml", "l"];

const T = 0b00010000;
const M = 0b00000100;
const B = 0b00000001;
const TM = T + M;
const TMM = T + M + M;
const TMB = T + M + B;
const TMMB = T + M + M + B;
const TMBB = T + M + B + B;
const TMMBB = T + M + M + B + B;
const combLen = (bin) => {
    const getBit = (idx) => (bin >> (idx - 1)) & 1;
    return getBit(1) + getBit(3) + getBit(5) + 2 * (getBit(2) + getBit(4));
};
const isAlpha = (c) => /^[a-zA-Z]*$/.test(c); // strict alphabet checking
const isDigit = (c) => /^[0-9]*$/.test(c);

export const splitEn = (string) => {
    for (const c in EnLowerOnly) {
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

                if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == 2) {
                    // 자 + 모
                    shift += 1;
                    combination += M;

                    if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == 3) {
                        // 모 + 모
                        shift += 1;
                        combination += M;
                    }
                    if (isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]) == 4) {
                        // 모 + 자
                        shift += 1;
                        combination += B;
                        let attachment3 = isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]);

                        if (attachment3 == 5) {
                            // 자 + 자 (종) + ?
                            if (currentIdx + shift + 2 == string.length) {
                                // IndexOutOfRange can be thrown
                                combination += B;
                            } else {
                                shift += 1;
                                let attachment4 = isAttachable(string[currentIdx + shift], string[currentIdx + shift + 1]);

                                if (attachment4 == 2) {
                                    // 자 + 자 + 모
                                    // pass
                                } else {
                                    // 자 + 자 + 자 (다음)
                                    combination += B;
                                }
                            }
                        } else if (attachment3 == 2) {
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
                separated.push([string[currentIdx], string[currentIdx + 1], string[currentIdx + 2]]);
                break;
            case TMMB:
                separated.push([string[currentIdx], string[currentIdx + 1] + string[currentIdx + 2], string[currentIdx + 3]]);
                break;
            case TMBB:
                separated.push([string[currentIdx], string[currentIdx + 1], string[currentIdx + 2] + string[currentIdx + 3]]);
                break;
            case TMMBB:
                separated.push([string[currentIdx], string[currentIdx + 1] + string[currentIdx + 2], string[currentIdx + 3] + string[currentIdx + 4]]);
                break;
        }
        jump = combLen(combination) - 1;
    }
    return separated;
};

export const splitKo = (string) => {
    let separated = [];
    for (let i = 0; i < string.length; i++) {
        let c = string.charAt(i);
        if (c === " ") {
            separated.push(" ");
            continue;
        }
        let hexcode = c.charCodeAt(0);
        if (hexcode >= 44032) {
            let hexZeropoint = hexcode - 44032;
            let topIdx = parseInt(hexZeropoint / 28 / 21);
            let midIdx = parseInt((hexZeropoint / 28) % 21);
            let botIdx = parseInt(hexZeropoint % 28);

            separated.push([topIdx, midIdx, botIdx]);
        } else if (12593 <= hexcode && hexcode <= 12643) {
            separated.push([hexcode]);
        } else {
            separated.push(c);
        }
    }
    return separated;
};

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
                convertedString += String.fromCharCode(RawMapper.indexOf(charCapsule[1]) + 12593);
                breaked = true;
                break;
            }
            switch (charCapsule[0]) {
                case 0:
                    topIdx = KoTopEn.indexOf(charCapsule[1]);
                    break;
                case 1:
                    midIdx = KoMidEn.indexOf(charCapsule[1]);
                    break;
                case 2:
                    botIdx = KoBotEn.indexOf(charCapsule[1]);
                    break;
            }
        }
        if (!breaked) {
            convertedString += String.fromCharCode(topIdx * 21 * 28 + midIdx * 28 + botIdx + 44032);
        }
    }
    return convertedString;
};

export const convKo2En = (string) => {
    let idxGroups = splitKo(string);
    let convertedString = "";
    for (let idxGroup of idxGroups) {
        for (let i = 0; i < idxGroup.length; i++) {
            let idxCapsule = [i, idxGroup[i]];
            if (typeof(idxCapsule[1]) != 'number') {
                convertedString += idxCapsule[1];
                continue;
            } else if (12593 <= idxCapsule[1] && idxCapsule[1] <= 12643) {
                convertedString += RawMapper[idxCapsule[1] - 12593];
                continue;
            }
            switch (idxCapsule[0]) {
                case 0:
                    convertedString += KoTopEn[idxCapsule[1]];
                    break;
                case 1:
                    convertedString += KoMidEn[idxCapsule[1]];
                    break;
                case 2:
                    convertedString += KoBotEn[idxCapsule[1]];
                    break;
            }
        }
    }
    return convertedString;
};

function isAttachable(i, l) {
    switch (true) {
        case KoTopEn.indexOf(i) != -1 && KoMidEn.indexOf(l) != -1:
            return 2;
        case KoMidEn.indexOf(i + l) != -1:
            return 3;
        case KoMidEn.indexOf(i) != -1 && KoBotEn.indexOf(l) != -1:
            return 4;
        case KoBotEn.indexOf(i + l) != -1:
            return 5;
    }
    return 0;
}

function print_bits(bitGroups) {
    for (const bitGroup in bitGroups) {
        for (bit in bitGroup) {
            print(bit);
        }
    }
}
