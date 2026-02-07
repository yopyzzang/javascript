호이스팅 (Hoisting)
====
호이스팅은 JS에서 변수나 함수가 선언된 위치 위에서도 참조가 가능하게 보이는 현상인데, 실제로는 컴파일 타임에 Environment Record 에 식별자가 미리 등록되기 때문에 발생하는 현상이다.   
아래는 함수 선언문 호이스팅의 예시임.   
```javascript
hello(); // 요피 안녕!

function hello() {
    console.log('요피 안녕!');
}
```
모든 식별자는 컴파일 타임 때 각 식별자가 어느 스코프에 속할지에 대한 스코프 구조(청사진)가 생성된다.   
이후 실행 컨텍스트가 생성될 때, 선언 종류별 바인딩이 생성되는데 function 키워드로 생성된 식별자는 함수 객체 바인딩이 생성 단계에서 바로 바인딩되기 때문에 호출이 가능하다.   
JS에서는 프로그램이 실행될 때 아래와 같은 과정을 거침.
```text
1. 생성 단계 (Creation Phase)
   - Execution Context (실행 컨텍스트) 생성
       - Lexical Environment
          - Environment Record
              - Declarative Environment Record (블록 스코프(let/const/class)
              - Object Environment Record (with 문, 전역 var)
              - Function Environment Record  (함수 선언/this 바인딩, new.target, arguments)       
          - Outer Reference
       - Variable Environment
       - PrivateEnvironment (ES2022+)
       - Realm
       - ScriptOrModule
2. 실행 단계 (Execution Phase) 
   - 선언문 초기화 및 할당 수행
   - 코드 한 줄씩 평가 (Statement / Expression 평가)
```
즉, function 키워드를 사용해 함수를 선언한 경우,  
생성 단계(Creation Phase)에서 Function Environment Record에 함수 객체 바인딩을 하기 때문에, 실행 단계(Execution Phase)에서 따로 할당할 필요가 없어 선언 위치보다 위에서 호출이 가능함.

아래는 함수 표현식의 호이스팅 예시임.
```javascript
hello(); // TypeError: hello is not a function

var hello = function hello() {
    console.log('안녕 요피!')
};
```
함수 표현식은 함수 선언문과 달리 생성 단계에서 함수 객체를 바인딩하는 것이 아닌 실행 단계에서 선언문이 초기화되고 할당을 진행함.   
var 키워드로 선언한 변수는 Object Environment Record에 undefined 로 바인딩되기 때문에 실행 단계에서 함수 표현식이 초기화되기 전에 ()을 사용하여 함수를 호출하려하면 타입 에러가 발생함.

중복 선언
----
동일한 스코프에서 변수가 두 번 이상 선언되면 생성 단계에서 재생성을 하지 않음.   
아래는 변수 중복 선언의 예시 코드임.
```javascript
var petName = "요피";
console.log(petName); // 요피

var petName; // 재선언(re-declaration) 되지 않음. (위에서 이미 생성 단계에서 바인딩되었기 때문에 새 바인딩을 만들지 않고 무시함.) 
console.log(petName); // 요피

// 코드 실행 단계에서 명시적으로 할당하기 때문에 값이 바뀜.
var petName = undefined;
console.log(petName); // undefined

// var 키워드 이외의 키워드(let, const)를 사용하여 변수를 중복 선언하는 경우 아래와 같은 오류가 발생함.
// SyntaxError: Identifier 'petName' has already been declared
```
아래는 변수 식별자와 함수 식별자의 이름이 같은 경우의 예시 코드임.
```javascript
var hello;
function hello() {
    console.log("요피 안녕!");
}
var hello;

typeof hello; // "function"

var hello = "안녕 요피~";
console.log(hello); // 안녕 요피~
```
생성 단계에서 function 키워드로 선언한 식별자가 먼저 평가되어 Environment Record에 함수 객체로 바인딩됨.   
이미 hello 식별자가 함수 객체로 바인딩되었기 때문에, var 키워드로 선언된 식별자는 무시되어 새 바인딩이 만들어지지 않음.   
단, 실행 단계에서 명시적 할당이 있을 경우에는 기존 바인딩의 값은 덮어씌워짐.   
생성 단계에서 함수 선언문을 먼저 평가하는 이유는, var 선언과 충돌하지 않으면서, 선언 위에서도 호출이 가능하고 같은 스코프 안 함수끼리 상호적으로 참조가 가능하기 때문임.

반복문에서의 중복 선언
----
반복문 스코프에서 변수를 선언하는 경우에 어떤 식으로 변수의 값이 바인딩되는지 아래 예시를 보면서 알아봄.
```javascript
// while 반복문 예시
var keepGoing = true;
while (keepGoing) {
    let value = Math.random();
    // var value = Math.random(); var 키워드를 통해 선언된 변수는 블록 스코프가 아닌, 전역 스코프에 바인딩됨.
    if (value > 0.5) {
        keepGoing = false;
    }
}
```
스코프 규칙(변수 재선언)은 각 스코프 인스턴스마다 적용됨. 즉, 실행 중에 각 스코프가 시작될 때마다 모든 것이 초기화됨.   
반복문에서는 새로운 반복이 시작될 때마다 자체적은 새 스코프가 생성됨.(새로운 Lexical Environment 생성) 이 때 value는 새 스코프 내에서 단 한 번만 선언됨.   
즉, 위 예시에서는 재선언 시도 자체가 없기 때문에 오류가 발생하지 않음.

아래는 for 반복문에서 재선언 예시임.
```javascript
// for...in, for...of 도 동일
for (let i = 0; i < 3; i++) {
    let value = i * 10;
    console.log(`${ i }: ${ value }`);
}
// 0: 0
// 1: 10
// 2: 20

/**
 * Lexical Environment (for block 1)
    let i = 0;
    let value = i * 10;
 * Lexical Environment (for block 2)
    let i = 1;
    let value = i * 10;
 * Lexical Environment (for block 3)
    let i = 2;
    let value = i * 10;
**/

```
결과 값을 통해 루프가 반복되어도 생성 단계에서 하나의 바인딩만 재사용하지 않는다는 것을 확인할 수 있음.   
만약 반복마다 새로운 스코프(Lexical Environment)가 생성되지 않았다면 모든 클로저가 마지막 값인 20을 참조했을 것임.   
실제로는 반복될 때마다 새 스코프가 생성되어 각각의 value 값이 독립적임.   
i의 스코프도 value의 스코프와 마찬가지로 for 반복문 스코프 안에 존재함.

추가적으로 for 반복문에 const를 사용할 경우 재할당 문제가 발생함.
```javascript
// for...of, for...in은 선언과 초기화를 동시에 진행
for (const x in [1, 2, 3]) {
    console.log(x);
}
for (const x in [1, 2, 3]) {
    console.log(x);
}

// for 반복문에서는 const i = 0; 으로 먼저 할당이 이루어졌고, 이를 i++을 이용하여 재할당이 일어나기 때문에 아래 에러가 발생함.
// TypeError: Assignment to constant variable.
for (const i = 0; i < 3; i++) {
    console.log(i);
}
```

TDZ (Temporal Dead Zone)
----
var 키워드로 선언한 변수는 생성 과정에서 초기 바인딩 값이 undefined 이다.   
반면 let, const 키워드로 선언된 변수는 생성 단계에서 초기 바인딩 값이 존재하지 않고 바인딩 슬롯만 생성함.   
해당 상태일 경우를 TDZ (Temporal Dead Zone) 라고 하며, 값 할당(초기화)은 실행 단계에서 이루어지기 때문에 할당되기 전에 변수를 접근하면 에러가 발생함.

아래는 TDZ의 예시 코드임. 
```javascript
console.log(petName); // ReferenceError: Cannot access 'petName' before initialization

let petName = "요피";

// 값이 초기화되지 않았기 때문에 TDZ 상태에서는 해당 변수에 접근할 수 없음.
anotherPetName = "로리"; // ReferenceError: Cannot access 'anotherPetName' before initialization
console.log(anotherPetName);

let anotherPetName = "나비";

let newPetName; // 명시적 할당으로 값을 지정하지 않았기 때문에 undefined 값
console.log(newPetName); // undefined
```
let, const 키워드를 사용한 변수는 생성 단계에서 초기 바인딩 값을 설정하지 않지만, 호이스팅 현상이 일어나지 않는 것은 아님.   
해당 키워드들도 생성 단계에서 Environment Record에 식별자가 미리 등록되기 때문임.   
아래는 예시 코드임.
```javascript
// Global LE
var petName = "요피";

{
    // Block LE
    console.log(petName); // TDZ
    // ReferenceError: Cannot access 'petName' before initialization
    
    let petName = "로리";
    // const petName = "로리" (const 키워드로 선언된 변수도 동일한 결과임.)
    console.log(petName); // 로리
}

// Lexical Environment (Global)
// └─ Environment Record
//    └─ petName -> "요피"

// Lexical Environment (Block)
// └─ Environment Record
//    └─ petName -> TDZ (let)
// └─ OuterReference -> Global LE
```
JS에서 새로운 블록이 있는 경우 새 LE를 생성함.   
해당 코드에서 같은 이름의 식별자인 petName이 LE(Block)의 ER에 등록되어있기 때문에 Outer를 참조하지 않음.   
블록 스코프 안에 있는 식별자 petName의 값(호이스팅된)을 접근할 경우 TDZ 상태에 있기 때문에 레퍼런스 에러가 발생하는 모습을 볼 수 있음.