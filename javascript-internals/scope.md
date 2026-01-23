스코프 (Scope)
====
스코프는 변수나 함수에 접근할 수 있는 유효 범위를 말함.   
JS에서의 스코프는 컴파일 타임에 결정되며, 이를 렉시컬 스코프(Lexical Scope)라고 함. 렉시컬의 의미는 컴파일 단계 중 렉싱(Lexing)과 관련이 있음.   

런타임에 스코프 변경
----
JS에서 스코프는 프로그램이 컴파일될 때 결정되고 런타임 환경에는 영향을 받지 않지만, 비엄격 모드에서는 런타임에도 프로그램의 스코프를 수정할 수 있음.   
그렇지만 그런 짓은 하지 말아야 함. 왜냐하면, 스코프가 런타임에 변경된다면 컴파일과 최적화가 이미 끝난 스코프를 다시 수정하기 때문에 CPU 자원을 사용해 성능에 악영향을 끼치기도 하고, 가독성과 예측성을 안좋게함. eval() 함수 같은 경우 XSS 기법과 같은 보안 문제로 야기될 수도 있음.   
런타임에 스코프를 변경하는 기능을 구현한 이유는 자바스크립트 초기에는 편의성과 즉시성을 우선했고, 동적 언어의 철학을 지키고자 해당 기능을 추가하게 됨.   
아래는 런타임에 스코프를 변경하는 예시들임.
```javascript
function badIdea() {
    // 런타임에 컴파일과 실행의 대상이 되는 문자열 형태의 소스 코드를 받음.
    eval("var oops = '이런..';");
    console.log(oops);
}

badIdea(); // 이런..
```
```javascript
var badIdea = { oops: "이런!" };
// 특정 객체의 스코프를 지역 스코프로 동적으로 변환함
with (badIdea) {
    console.log(oops); // 이런!
}
```

렉시컬 스코프 (Lexical Scope)
----
컴파일레이션 중 스코프가 결정되는 방식을 JS에서는 렉시컬 스코프라고함.   
렉시컬 스코프는 변수가 어디서 호출되었는지가 아니라 어디서 선언되었는지에 따라 그 유효 범위가 결정되는 스코프 규칙임.   
컴파일 도중에는 프로그램 실행에 필요한 모든 렉시컬 스코프가 들어간 지도가 만들어짐. 여기에는 렉시컬 환경(Lexical Environment)이라고 칭해지는 스코프가 전부 정의되고 각 스코프에 해당하는 식별자가 추가됨.
아래는 스코프 예제임.
```javascript
// 외부/전역 스코프: pets, getPetName, nextPet
const pets = [
    { id: 14, name: '로리' },
    { id: 15, name: '요피' },
    { id: 16, name: '나비' },
    { id: 17, name: '루비' }
];

function getPetName(petID) {
    pet = '초롱이' // 변수 선언도 없이 할당, 타깃 할당이라는 목적을 위해 전역 스코프에 등록됨. (strict mode 가 아닐 때)
    // 함수 스코프
    for (let pet of pets) {
        // 블록 스코프 (for-loop)
        if (pet.id === petID) {
            // 블록 스코프 (if-statement)
            return pet.name;
        }
    }
}

const nextPet = getPetName(15);
console.log(nextPet); // 요피
console.log(pet); // 초롱이
```

JS 코드가 실제로 실행될 때 각 스코프마다 Lexical Environment가 만들어짐. 
```text
LexicalEnvironment {
    EnvironmentRecord   // 실제 변수/식별자 저장
    [[Outer]]           // 외부 스코프(LE) 참조
}
```
이를 실행 컨텍스트(Execution Context)가 참조함.  
함수가 호출될 때는 LE와 EC가 생성되며 이는 동일한 함수가 여러번 호출되어도 매 번 생성됨. 단, 비효율적이라면 엔진에서 판단하여 최적화함.   
JS에서 스코프를 탐색할 때 찾으려는 변수나 함수가 없을 경우에 본인 스코프의 바깥(외부) 스코프를 참조하여 올라가도록 구현되어 있음.   
