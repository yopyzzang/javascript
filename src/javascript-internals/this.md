this 키워드
====
함수는 자신이 어디까지 접근 가능한지를 결정하는 특징이 있음.  
해당 특징은 실행 컨텍스트(execution context) 개념으로 설명되는데, 함수는 this 키워드를 통해 실행 컨텍스트에 접근함.   

실행 컨텍스트 (Execution Context)
----
실행 컨텍스트는 JS 코드가 실행되기 위한 환경 정보 묶음임.   
JS 엔진은 코드를 직접 실행하지 않고, 항상 실행 컨텍스트를 먼저 만들고 그 안에서 실행함.  
아래와 같은 종류의 실행 컨텍스트가 있음.   
1. 전역 실행 컨텍스트 (Global EC)
   - 프로그램 시작 시 단 1번만 생성
   - 브라우저: window
   - Node.js: global
2. 함수 실행 컨텍스트 (Function EC)
   - 함수 호출마다 생성
   - 호출할 때마다 새로 만들어짐
3. Eval 실행 컨텍스트
    - eval() 사용 시 (잘 안쓰임.)

실행 컨텍스트의 구조는 아래와 같음
```text
Execution Context Record:
- LexicalEnvironment
- VariableEnvironment
- PrivateEnvironment (ES2022+)
- Realm
- ScriptOrModule
- Function (함수 EC일 경우)
```
JS는 먼저 소스 코드를 파싱하면서 추상 구문 트리(AST)로 변환하고 이를 Ignition(Bytecode Generator)이 바이트코드를 생성하고 이를 인터프리터가 읽어 실행함.   
파싱 단계에서는 문법 분석, 스코프 분석, 변수/함수 선언 수집, Scope Tree를 생성하는데, 이 정보들을 토대로 실행 컨텍스트가 만들어짐.   
아래 예제는 파싱 단계에서의 개념적 예시임.
```javascript
function outer(a) {
    let x = 1;
    function inner() {
        return x;
    }
}
```
```text
Global Scope
 └─ outer Scope
     ├─ a
     ├─ x
     └─ inner Scope
         └─ x (outer reference)
```
실행 컨텍스트는 생성 시, 내부 슬롯인 [[ThisValue]] 를 바인딩하는데 이는 함수 호출이 발생했을 때 바인딩함.  
아래는 함수의 this 바인딩 예제임.
```javascript
function notBaseObject() {
    console.log(this);
}
// 브라우저에서 실행 시 window global object 출력, node에서 실행 시 global object 출력 (단, strict mode 일 경우 undefined 출력)
notBaseObject();


function baseObject() {
    console.log(this.text);
}

const object = {
    text: '텍스트',
    assignment: baseObject
}
object.assignment(); // 텍스트
baseObject.call({text: 'this가 참조하는 객체를 결정하는 메서드인 call()을 사용'});
```
엔진에서는 아래와 같은 개념적 흐름을 가짐.
```text
1. CallExpression의 base object 없음
2. strict 여부 확인
3. this 결정
    - strict mode -> undefined
    - non-strict -> global object
4. FunctionEnvironmentRecord 생성
5. [[ThisValue]] 슬롯에 저장
```

전역 실행 컨텍스트에서의 this
----
함수를 실제로 호출하는 시점에 this 바인딩 되는 함수 실행 컨텍스트와 달리,   
전역 실행 컨텍스트의 this는 해당 Realm의 Global Object로 설정됨.   
Realm은 JS가 실행되는 호스트 환경을 의미하는데, 이 호스트 환경에는 Global Object, Global Environment, Intrinsics (Array, Object ...)이 포함됨.   
