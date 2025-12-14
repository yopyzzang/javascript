원시 타입 (Primitive type)
====
프로그램에서 정보의 기본적인 단위는 값(value)이고 값에는 데이터가 저장됨.   
원시 값(primitive, 또는 원시 자료형)이란 객체가 아니면서 메서드 또는 속성도 가지지 않는 데이터임.   

원시 값에는 아래와 같이 7가지의 종류가 있음.
```
string
number
bigint
boolean
undefined
symbol
null
```
JS에서 프로그램에 값을 주입할 때는 아래와 같이 리터럴(literal)을 사용함.   
```javascript
exampleFunction("example"); // "example"은 원시 문자열 리터럴, 문자열의 범위는 ("",'',``)으로 정의
```

리터럴 (Literal)
---
변수나 상수 없이도 코드 그 자체로(literally) 프로그램에 주입되는 데이터
```javascript
42           // 정수 리터럴
'hello'      // 문자열 리터럴
true         // 불리언 리터럴
null         // null 리터럴
[1,2,3]      // 배열 리터럴
{a: 1, b: 2} // 객체 리터럴
```

불변성 (Immutable)
---
모든 원시 값은 "불변"하여 변형할 수 없음.   

아래는 불변성을 보여주는 문자열 원시 값 예제임.
```javascript
let str = 'hello';
console.log(str[0]); // 'h'

str[0] = 'H';
console.log(str); // 'hello'

// 해당 예시는 새로운 문자열을 해당 변수에 재할당한 것일 뿐, 불변성이 깨진 것이 아님.
str = 'Hello';
console.log(str); // 'Hello'
```
원시 값은 스택(Stack) 영역에 저장됨.  
아래는 원시 값이 어떻게 메모리에 저장되는지에 대한 예시임.
```javascript
let x = 10;
let y = x; // y에 x값을 복사
x = 20; // x를 새로운 값으로 재할당

Stack:
x -> 20
y -> 10
```

JS에서 나타나는 특징
---
원시 값은 메서드, 속성이 존재하지 않는 데이터인데도 JS에서는 아래와 같은 예시가 가능한데,  
이는 JS 엔진에서 데이터를 임시 래퍼 객체로 자동 포장(Auto Boxing)하는 작업을 하기 때문임.
```javascript
// 암시적으로 String 래퍼 객체를 생성함, includes 메소드 호출이 끝나면 임시 래퍼 객체는 곧바로 폐기됨.
// 해당 작업은 속성 접근이나 메서드 호출 시점에 수행됨.
"test".includes("t"); // true

"test".foo = 1; // 속성 접근 시 String 객체로 래핑
console.log("test".foo); // undefined (해당 임시 래퍼 객체는 호출 시점에 사라짐(GC).)
```