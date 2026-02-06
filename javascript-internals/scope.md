스코프 (Scope)
====
스코프는 변수나 함수에 접근할 수 있는 유효 범위를 말함.   
JS에서의 스코프는 컴파일 타임에 모든 스코프의 정보를 담은 설계도가 완성됨.

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
JS에서 코드의 어휘적(Lexical) 구조/위치에 따라 스코프가 정적으로 결정되기 때문에 렉시컬 스코프라는 이름을 붙힘.   
렉시컬 스코프는 다이나믹 스코프와 달리, 변수나 함수가 어디서 호출되었는지가 아니라 물리적으로 코드 상에서 어디서 선언되었는지에 따라 그 유효 범위가 결정되는 스코프 규칙임.   
아래는 렉시컬 스코프의 예제임.
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

함수 이름 스코프
----
함수 선언문은 아래와 예시와 같이 작성되며 해당 함수의 스코프는 전역 스코프에 askQuestion이라는 식별자를 생성함.
```javascript
function askQuestion() {
    // 함수 선언문
}
```
함수 표현식은 아래와 같이 작성되며, 해당 표현식의 스코프는 외부 스코프(전역 또는 현재 함수 스코프)에 그침.   
ofTheTeacher의 스코프는 함수 표현식 자체의 내부임. 즉 ofTheTeacher 식별자는 함수 안에 식별자 그 자체로 선언됨.
```javascript
var askQuestion = function ofTheTeacher() {
    "use strict"
    var innerVar = "hello";
    // ofTheTeacher 함수는 기명 함수 표현식 자체가 만드는 내부 스코프에서만 접근 가능
    console.log(ofTheTeacher);
    ofTheTeacher = 123 // TypeError: Assignment to constant variable.
}

askQuestion(); // function ofTheTeacher()...

// 함수 외부 스코프에서는 접근할 수 없음.
console.log(ofTheTeacher); // Reference Error: ofTheTeacher is not defined
```
위 기명 함수 표현식의 스코프 환경은 아래와 같음
```text
Lexical Environment 1 (전역 또는 상위 스코프)
  ↓
Lexical Environment 2 (함수 이름 바인딩)
  [[OuterEnv]]: → Lexical Environment 1
  - ofTheTeacher: [Function Object]
  ↓
Lexical Environment 3 (함수 본문)
  [[OuterEnv]]: → Lexical Environment 2
  - innerVar: "hello"
```
중간 단계의 렉시컬환경을 별도로 엔진이 구성하는 이유는 함수 이름을 불변으로 보호하면서 함수 본문의 변수들과 격리하고 재귀 호출 시 항상 자기 자신을 정확히 참조하도록 보장하기 위해서임.

화살표 함수
----
ES6에서는 언어 차원에서 함수 표현식을 만들 수 있는 새로운 방법인 화살표 함수가 도입되었음. 이를 사용하면 function 키워드를 사용하지 않고도 함수를 정의할 수 있음.   
화살표 함수는 렉시컬 스코프 관점에서 익명으로 취급되며 함수를 참조하는 연관 식별자와 직접적으로 연결되어 있지 않고 자체적으로 추론함.
```javascript
var askQuestion = () => {
    // ...
};

askQuestion.name; // askQuestion
```
화살표 함수와 function 키워드를 통해 선언한 함수는 익명이라는 특성 이외에는 동일한 렉시컬 스코프 규칙을 적용받음.   
화살표 함수 역시 함수가 정의된 위치에 따라 스코프가 결정되며, 변수 조회 규칙(스코프 체인 탐색) 역시 동일함.   
단, 화살표 함수는 this, argument, super 가 동적으로 바인딩되는 것이 아닌 렉시컬 바인딩됨.
```javascript
var globalVar = "global";

function outer() {
    var outerVar = "outer";
    
    // 일반 함수
    function regularFunc() {
        var localVar = "local";
        
        console.log(globalVar); // ✅ 렉시컬 스코프
        console.log(outerVar);  // ✅ 렉시컬 스코프
        console.log(localVar);  // ✅ 자체 스코프
        console.log(this);      // ❌ 동적 바인딩
        console.log(arguments); // ❌ 자체 arguments
    }
    
    // 화살표 함수
    const arrowFunc = () => {
        var localVar = "local";
        
        console.log(globalVar); // ✅ 렉시컬 스코프
        console.log(outerVar);  // ✅ 렉시컬 스코프
        console.log(localVar);  // ✅ 자체 스코프
        console.log(this);      // ✅ 렉시컬 바인딩 (상위의 this)
        console.log(arguments); // ✅ 렉시컬 바인딩 (상위의 arguments)
    };
}
```

Node.js
----
Node.js에서는 엔트리 파일을 포함해 모든 JS파일을 모듈로 처리함. 브라우저에서 파일을 로드할 때와는 다르게 각 JS 파일이 자체적으로 스코프를 갖음.   
태생적으로 CommonJS라는 모듈 형식을 지원했는데 이는 코드를 함수로 감싸 var, function 선언이 전역 변수로 취급되는 것을 방지하고 선언들을 함수 스코프에 포함시킴.   
아래는 가상의 코드 예시임.   
```javascript
function Module(module, require, __dirname, ...) {
    var petName = "요피";
    
    function hello() {
        console.log(`${petName} 안녕!`);
    }
    
    hello();
    
    module.export.hello = hello;
}
```
Node.js는 추가 함수 Module()을 호출해 모듈을 실행함. 식별자들이 전역에 선언되어 있지 않고 모듈 스코프에 주입됨.   
전역 변수를 선언하려면 global에 프로퍼티를 추가하는 것이 유일한 방법임.