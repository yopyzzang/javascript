함수
====
프로그래밍 언어에서 '함수'라는 단어에는 다양한 의미가 있음.   
예를 들어, 함수형 프로그래밍 패러다임에서는 함수가 정확한 수학적 정의를 가지고 준수해야할 엄격한 규칙의 집합을 의미함.   
JS로 개발할 때는 함수보다 좀 더 포괄적인 개념인 프로시저(procedure)를 프로그램에 녹여내는 것이 중요함.   
여기서 프로시저는 한 번 이상 호출할 수 있고 입력값이 있을 수 있으며 하나 이상의 출력값을 반환하는 구문의 모음을 이야기함. 간단히 이야기하면 프로시저는 특정 작업을 수행하기 위한 코드 묶음인데, 어떤 일을 하기 위한 *절차(procedure)를 이름 붙혀 놓은 것이라고 할 수 있음.
추가적으로 JS의 함수는 객체로써, 값으로 취급됨.

함수 선언문 (Function declaration)
----
함수 선언이라는 이름은 해당 함수가 다른 문의 표현식이 아니라, 단독으로 실행 흐름을 구성하는 문(statement) 혹은 명령 자체이기 때문에 붙게 됨.   
함수 선언으로 정의한 함수 awesomeFunction은 식별자 awesomeFunction과 실제 함수를 나타내는 값의 연관이 코드 실행 단계가 아닌 컴파일 단계에서 맺어짐.
```javascript
// javascript에서 함수 선언문으로 함수를 선언한 예시
awesomeFunction('cool'); // 함수 선언은 실행 전에 식별자와 함수 객체 바인딩이 완료되기 때문에, 호이스팅 발생

function awesomeFunction(coolThing) {
    console.log(coolThing);
    return amazingStuff;
}
```
자바스크립트 엔진은 코드를 실행하기 전에 컴파일 단계를 거친다.  
이 단계에서 엔진은 소스 코드를 파싱하여 AST(추상 구문 트리)를 생성하고, 이를 바탕으로 바이트코드를 만들어낸다.
이 과정에서 스코프 구조와 선언 정보가 분석되며, 이후 실행 컨텍스트를 생성하기 위한 설계 정보가 미리 준비된다.

컴파일이 완료된 뒤, 실제 코드 실행에 앞서 **전역 실행 컨텍스트(Global Execution Context)**가 생성되는 과정의 일부로서 선언 바인딩 초기화(Declaration Binding Instantiation) 과정을 수행한다.

선언 바인딩 초기화 단계에서는 해당 스코프에 존재하는 선언들(함수 선언, 변수 선언 등)을 확인하고
실행 컨텍스트 내부의 환경 레코드(Environment Record)에 필요한 식별자 바인딩을 준비한다.

특히 **함수 선언문(Function Declaration)**의 경우, 다음과 같은 특징을 가진다.

함수 선언은 컴파일 단계에서 발견되며, 엔진은 이 스코프에 어떤 함수 선언들이 존재하는지를 미리 기록해 둔다.  
그리고 전역 실행 컨텍스트가 생성되는 시점에, 이 정보를 사용해 식별자와 함수 객체를 즉시 바인딩한다.

함수 표현식 (Function expression)
----
함수 선언문과 달리 아래 예제는 함수 표현식이라고 부른다.  
함수 표현식으로 선언된 함수는 함수와 함수 식별자가 코드가 실행되기 전에는 관계를 맺지 않음.
```javascript
awesomeFunction('cool') // ❌ 오류 발생
// const awesomeFunction = ...
// var awesomeFunction = ...
let awesomeFunction = function(coolThing) {
    console.log(coolThing);
    return amazingStuff;
}
```
함수 표현식은 컴파일 단계에서 “변수가 있다”는 사실만 기록되고, 실제 함수 객체 생성과 식별자 바인딩은 코드가 실행되는 도중 해당 대입문이 평가될 때 이루어진다.   

선언 바인딩 초기화 단계에서 변수 선언을 확인하고 실행 컨텍스트 내부의 환경 레코드에 기록한다.  
다만, 변수이므로 환경 레코드에는 아래 예시와 같이 기록됨.
```text
Environment Record(환경 레코드)
awesomeFunction -> <uninitialized> // TDZ(Temporal Dead Zone)

단, var 키워드를 사용해 변수를 선언한 경우 선언 즉시 undefined로 초기화되기 때문에, uninitialized가 아닌 undefined이다.
실제로 let,const를 키워드로 사용해 변수를 선언한 경우에는 ReferenceError가 발생하고, var을 키워드로 사용해 변수를 선언하면 TypeError가 발생한다.  
```
함수 표현식은 함수 객체가 실제 바이트코드가 실행되는 시점에 생성되기 때문에 위 예시와 같은 오류가 발생함.

다양한 형태의 함수
----
위 예제 코드의 함수는 익명 함수 표현식(anonymous function expression)임.   
익명 함수 표현식은 function 키워드와 매개변수가 들어갈 괄호 사이에 함수 이름을 나타내는 식별자가 없는 경우를 말함.   
예제 코드에서 변수에 익명 함수 표현식을 할당해주었기 때문에 JS에서는 함수의 이름을 awesomeFunction으로 추론함.   

아래는 기명 함수 표현식(named function expression) 예제 코드임.   
```javascript
// let awesomeFunction = ...
// var awesomeFunction = ...
const awesomeFunction = function someFunction(coolThing) {
    console.log(coolThing);
    return amazingStuff;
}
awesomeFunction.name = 'namedFunction'; // name 프로퍼티를 사용해 지정한 이름보다 직접 지정한 이름이 우선순위가 높음
console.log(awesomeFunction.name); // someFunction
```
해당 코드는 컴파일 중에 식별자 someFunction과 함수 표현식에 직접적인 연관이 생김.   
단, 식별자 awesomeFunction과의 연관 관계는 해당 구문이 실행될 때(런타임)까지는 발생하지 않음.   
또한 직접 지정한 이름(someFunction)은 name 프로퍼티를 사용해 지정한 이름보다 우선순위가 높음.   
아래는 함수의 여러가지 선언 방식의 예제임.  
```javascript
/**
 * 제네레이터 함수는 호출 즉시 실행되지 않고 정지 상태로 존재하고, 이터레이터 객체를 반환함.
 * 아래는 제네레이터 함수 예제임.
 **/
function* generatorFunction() {
    yield 1;
    yield 2;
    yield 3;
}
const gen = generatorFunction();
gen(); // gen {<suspended>} (V8 기준)
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

/** 
 * 비동기 함수는 작업이 완료되기를 기다리지 않고 다음 코드를 실행하도록 하고, return 값은 프로미스 객체로 감싸져 반환됨.(Promise.resolve(value))
 * 아래는 비동기 함수 예제임.
 **/
async function asyncFunction() {
    console.log(1);
    await Promise.resolve(); // await는 Promise가 resolve 될 때까지 현재 async 함수 실행을 일시적으로 중단함.
    console.log(2);
}
console.log(0);
asyncFunction();
console.log(3);
// 출력 순서: 0 -> 1 -> await -> 3 -> 2

/**
 * 비동기 제네레이터 함수는 호출 시 즉시 실행되지 않고 정지 상태로 존재하고, 이터레이터 객체를 반환함.
 * 해당 이터레이터 객체의 next() 는 Promise로 반환됨.
 **/
async function* asyncGen() {
    yield 1;
    yield 2;
}
asyncGen(); // asyncGen {<suspended>}
asyncGen().next(); // Promise {<fulfilled>: {…}}
await asyncGen().next() // { value: 1, done: false }

// Generator + await 활용 예시
async function* asyncGen() {
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        yield i;
    }
}

// 비동기 IIFE(즉시 실행 화살표 함수 표현식)
(async () => {
    for await (const v of asyncGen()) {
        console.log(v);
    }
})();
```