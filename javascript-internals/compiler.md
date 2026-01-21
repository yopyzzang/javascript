코드 컴파일
====
JS는 컴파일 언어에 가까움, 이 사실이 중요한 이유는 JS가 어떻게 작동하는 지에 대한 모든 것들을 관통하는 주제이기 때문임.   
코드 실행 전에 별도 단계에서 파싱과 컴파일이 이루어지기 때문에 미리 구성된 정보와 관계를 토대로 작동함.   
고전 컴파일러 이론에서는 프로그램이 컴파일러의 아래 3가지 주요 단계를 거쳐 처리된다고 정의함.
1. 토크나이징(Tokenizing)/렉싱(Lexing): 문자열을 토큰(token)으로 불리는 의미 있는 조각으로 쪼갬. 예를 들어 `var a = 2;` 과 같은 코드를 토큰 조각으로 쪼갠다고 했을 때 조각은 `var, a, 2, ;`로 쪼개어짐. 공백은 해당 프로그래밍 언어에서 유의미한가를 따져서 토큰으로 만들거나 만들지 않음. 토크나이징과 렉싱의 차이는 토큰을 무상태(stateless) 방식으로 인식하는지와 상태 유지(stateful) 방식으로 인식하는지에 있음. 토크나이저(Tokenizer)가 위 예시 코드인 a를 별개의 토큰으로 분리할지 아니면 다른 토큰의 일부로 처리할지를 결정할 지의 차이가 있는데, 다른 토큰의 일부로 처리한다면 상태 유지 파싱 규칙을 적용한 것이며 이는 렉싱이라고 불림.
2. 파싱(Parsing): 토큰 배열을 프로그램 문법 구조를 반영하는 중첩 원소 기반의 트리인 AST(추상 구문 트리)로 변환함. `var a = 2;`는 파싱을 거치면 변수 선언(VariableDeclaration)이라 불리는 최상위 노드와 a의 값을 가지는 식별자(Identifier) 노드, 할당식(AssignmentExpression)이라 불리는 노드를 자식 노드로 가진 트리가 됨. 여기서 할당식 노드는 2라는 값을 가지는 숫자 리터럴(NumbericLiteral)을 자식 노드로 가짐.
3. 코드 생성: AST를 컴퓨터가 실행 가능한 코드로 변환함. 코드 생성 단계는 언어 혹은 목표하는 플랫폼 등에 따라 크게 달라짐. 

위 과정을 정리하자면 JS 엔진은 `var a = 2;`라는 코드를 AST로 바꾸고 AST를 컴퓨터가 실행 가능한 코드로 바꾸는데, 이 과정에서 실제 a라는 식별자는 스코프에 미리 등록되며, 실제 메모리 할당과 값의 대입은 실행 단계에서 이루어짐.

JS는 다른 언어와는 다르게 사전에 컴파일된 결과물을 받지 못하기 때문에 JS 엔진은 충분한 시간을 확보하지 못한 채 최적화를 수행함. 그렇기 때문에 JS 엔진은 레이지 컴파일(lazy compile)이나 핫 리컴파일(hot recompile)같은 JIT를 사용함.

파싱과 컴파일
----
JS가 어떻게 프로그램을 처리하는지 관찰할 때 중점적으로 봐야 할 것은 프로그램 처리는 최소 파싱과 컴파일이라는 두 단계에서 일어난다는 사실임.  
즉, 파싱과 컴파일이 먼저 일어나고 그 이후에 실행된다는 것임. ECMA 명세서에 '컴파일레이션이 반드시 필요하다'라고 정의되어있진 않지만, 요구 사항을 처리하기 위해서는 선 컴파일 후 실행(compile-then-execute) 접근 방식을 취하지 않으면 명세서에서 요구하는 동작을 할 수 없음.   

아래는 선 컴파일 후 실행 접근 방식을 입증할 수 있는 JS의 사례들임.
```javascript
// 구문 오류

var greeting = "안녕하세요.";

/** 인터프리트만 되었다고 한다면, 해당 코드(console.log)는 실행되어야 했음.
 * 하지만 실제로는 파싱 과정을 거치기 때문에 구문 오류를 판단함. */
console.log(greeting); 
greeting = ."안녕";

// SyntaxError: Unexpected token '.'
```
```javascript
// 초기 오류

console.log("잘 지내시죠?");

saySomething("안녕하세요.", "안녕");
/**
 * ECMA 명세서에 따르면 엄격 모드에서 프로그램을 실행할 때, 가이드를 어긴 경우 초기 오류를 발생시킴.
 * 프로그램 실행 전에 코드 전체가 파싱되었기 때문에 초기 오류를 발생시킬 수 있음.
 **/
function saySomething(greeting, greeting) {
    "use strict"
    console.log(greeting);
}

// SyntaxError: Duplicate parameter name not allowed in this context
```
```javascript
// 호이스팅

/**
 * 컴파일 과정에서 식별자(greeting)가 알맞은 스코프에 등록되었고,
 * 블록 스코프의 식별자가 초기화되기 전(TDZ)에 접근하려고 해서 에러가 발생함.
 * 즉 실행 전에 파싱 및 스코프 결정 과정을 미리 거쳤기 때문에 에러가 발생할 수 있었음. 
 **/
function saySomething() {
    // 함수 스코프
    var greeting = "안녕하세요."; // shadowing..
    {
        // 블록 스코프
        greeting = "잘 지내시죠?"; // 여기서 에러 발생, TDZ 상태에 있는 greeting 에 값을 할당하려고 했기 때문.
        let greeting = "안녕!";
        console.log(greeting);
    }
}

saySomething();

// ReferenceError: Cannot access 'greeting' before initialization
```

컴파일러 동작
----
JS 프로그램은 컴파일 후 실행된다는 지식을 바탕으로, JS 엔진에서 어떻게 변수를 식별하고 컴파일 후 프로그램의 스코프를 결정하는지 아래의 예제를 통해 파악해보도록 함.  
선언을 제외하고 프로그램 내 모든 변수와 식별자는 할당의 타깃(target)이나 값의 소스(source) 둘 중 하나의 역할을 함. 보통 할당 연산자를 기준(=)으로 LHS(left-hand side)에는 할당의 타깃, RHS(right-hand side)에는 소스를 의미함.
```javascript
/**
 * 할당 연산자(=)을 이용한 할당 연산 (pets이 할당의 타깃)
 * 컴파일 단계에서 아래와 같은 과정을 거침.
 * - 식별자 pets 등록
 * - pets의 초기 상태를 undefined로 둠.
 * 
 * 실행 단계에서 아래과 같은 과정을 거침.
 * pets = [...] 실행
 * RHS 평가 -> [...]
 * LHS 참조 -> pets
 * PutValue(pets, [...])
 * 
 * 즉 값의 연결은 실행 단계에서 일어남.
 **/
var pets = [
    { age: 14, name: "로리" },
    { age: 15, name: "요피" },
    { age: 16, name: "나비" },
    { age: 17, name: "루비" },
];

/**
 * function 선언은 일반적인 할당문(LHS = RHS)이 아니라,
 * 컴파일 단계에서 식별자와 함수 객체의 바인딩이 즉시 설정되는 특수한 선언 형태임.
 * 
 * getPetName 식별자는 스코프가 구성되는 시점에 이미 함수 객체와 연결되며 실행 중에 할당되는 것이 아님.
 * 
 * 컴파일 단계에서 아래와 같은 과정을 거침.
 * - 식별자 getPetName 등록
 * - 함수 객체 생성
 * - getPetName -> <function object> 바인딩
 * 
 * 즉, 변수 할당과 달리, 실행 중에 값을 대입하는 것이 아님.
 **/
function getPetName(petAge) {
    // 루프가 돌 때마다 pet에 값을 할당 (pet이 할당의 타깃)
    for (let pet of pets) {
        if (pet.age == petAge) {
            return pet.name;
        }
    }
}

// petAge에 15라는 값을 할당 (petAge가 할당의 타깃)
var nextPet = getPetName(15); 

console.log(nextPet); // 요피
```