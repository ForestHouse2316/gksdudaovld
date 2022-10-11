<p align="center">
  <img src="https://raw.githubusercontent.com/ForestHouse2316/gksdudaovld/main/Document/logo.png" height="250px"/> <br>
  <img src="https://img.shields.io/badge/License-MIT-yellow" /></a> <br>
  <img src="https://img.shields.io/badge/Python-1.0.6b1-brightgreen" /></a>
  <img src="https://img.shields.io/badge/JavaScript-1.0.6b2-brightgreen" /></a>
  <img src="https://img.shields.io/badge/Java-unsupported-red" /></a>
  <img src="https://img.shields.io/badge/C++-unsupported-red" /></a>
</p>

# gksdudaovld 한영매핑
Mapping program to convert between Korean and English on QWERTY keyboard\
QWERTY 키보드용 한국어/영어 간 매핑 프로그램입니다
```
gkssudgktpdy => 안녕하세요
```
위와 같이 한국어를 영어로, 또는 영어를 한국어로 바꿀 수 있습니다

> 알쓸잡지식 : gksdudaovld 은 '한영매핑' 을 영어타자로 치면 나오는 글자입니다 :)\
> 알아두면 패키지 설치할 때나 import 할 때 유용하게 쓸 수 있답니다~


## 🚢 Installation & Import
### Python
Python 3 버전 이상만 지원됩니다.

pip 를 통해 설치할 수 있습니다.
``` console
pip install gksdudaovld
```
다음과 같이 import 하여 사용하면 됩니다
``` python
from gksdudaovld import KoEnMapper
```

### JavaScript
npm 을 통해 설치하게 됩니다.
``` console
npm i gksdudaovld
```
- ES6 방식 import 는 다음과 같습니다.
    ``` JS
    import { convEn2Ko, convKo2En } from "gksdudaovld";
    ```
- CommonJS 방식 import 는 다음과 같습니다.
    ``` JS
    const kem = require("gksdudaovld");
    ```

### Java
Unsupported

### C++
Unsupported

## [Changelog](https://github.com/ForestHouse2316/gksdudaovld/blob/main/Changelog.md)

## Basic Usage

### Python
``` python
from gksdudaovld import KoEnMapper
KoEnMapper.conv_en2ko("dkssudgktpdyyyyyyyyy~!")
KoEnMapper.conv_ko2en("ㅗ미ㅐ ㅛㅐㅕ 혀ㅛㄴ~!")
```
``` python
>>> '안녕하세요ㅛㅛㅛㅛㅛㅛㅛㅛ~!'
>>> 'halo you guys~!'
```

### JavaScript
``` JS
console.log(convEn2Ko("dkssudgktpdy :)"));  // ES6

// You can change the variable named "kem" as you declared at the import line.
console.log(kem.convKo2En("ㅗㅑ ㄷㅍㄷ교ㅐㅜㄷ :)"));  // CommonJS
```
``` JS
>>> "안녕하세요 :)"
>>> "hi everyone :)"
```

### Java

### C++
