POLE (Principle Of Least Exposure)
====
POLE란 최소 노출의 원칙을 이야기하는데, 이 원칙을 JS에서 지키려면 프로그램의 스코프에 등록된 변수를 최소한으로 노출하도록 구성해야함.   
만약 모든 변수를 전역 스코프에 배치한다면 이름 충돌, 예기치 않은 작동, 의도하지 않은 종속성 등 다양한 문제를 야기할 수 있음.   
POLE를 지키며 소프트웨어를 설계한다면 앞선 3가지 위험을 최소화할 수 있음. 아래는 예시 코드임.
```javascript
function diff(x, y) {
    if (x > y) {
        let tmp = x; // 블록 스코프로 제한
        x = y;
        y = tmp;
    }
    return y - x;
}

diff(3,7); // 4
diff(7,5); // 2
```
예시 코드에서 tmp를 최소 스코프인 블록 스코프로 제한하면 코드 가독성과 같은 변수를 다시 선언하는 실수를 줄일 수 있음.

아래는 함수 스코프를 통해 노출을 최소한 예시임.
```javascript
// 전역 스코프
var cache = {};

function factorial(x) {
    if (x < 2) return 1;
    if (!(x in cache)) {
        cache[x] = x * factorial(x - 1);
    }
    console.log(`cache hit: ${cache[x]}`);
    return cache[x];
}

console.log(factorial(6)); // 720
console.log(cache); // { '2': 2, '3': 6, '4': 24, '5': 120, '6': 720 }

console.log(factorial(7)); // 5040
```
위 코드에는 전역 변수로 cache를 선언하여 캐시에 저장된 결과 값을 즉시 리턴하도록 구현한 함수임.   
단, cache 변수에 전역 스코프에 등록되어 외부에 노출되어 있기 때문에, 캐시를 조작하여 의도치 않은 결과를 초래할 수 있음.

아래는 함수 스코프에 cache 변수를 선언하여 구현한 예시 코드임.
```javascript
function hideTheCache() {
    // 함수 스코프
    var cache = {};
    return factorial;
    
    function factorial(x) {
        // 함수 내부 스코프
        if (x < 2) return 1;
        if (!(x in cache)) {
            cache[x] = x * factorial(x - 1);
        }
        return cache[x];
    }
}

var factorial = hideTheCache(); // cache, factorial 함수가 클로저가 됨.

factorial(6); // 720
factorial(7); // 5040
```
위 예시는 캐시를 비공개 변수로 만들어 외부 접근을 차단하고 클로저를 통해 cache를 재사용하는 예시임.   

매 번 새로운 함수와 스코프를 만드는건 귀찮은 일이므로 아래와 같이 함수 표현식을 사용하는게 나을 수 있음.
```javascript
// IIFE (즉시 실행 함수 표현식)
var factorial = (function hideTheCache() {
    // 자체 스코프
    var cache = {}
    
    function factorial(x) {
        if (x < 2) return 1;
        if (!(x in cache)) {
            console.log(`cache miss: ${x}`);
            cache[x] = x * factorial(x - 1);
        }
        return cache[x];
    }
    
    return factorial;
})();

factorial(6); // 720
factorial(7); // 5040
```
해당 예시에서는 함수 표현식으로 정의하여 hideTheCache의 스코프는 전역 스코프가 아니기 때문에 전역을 오염시키지 않음.   
또한 초기화 코드인 것을 명확하게 확인할 수 있고 간결함.

아래는 IIFE를 사용했을 때 유의할 사항에 대한 예시 코드임.
```javascript
// return문 문제
function processData(data) {
    if (!data) {
        return "No data"; // processData 함수를 종료
    }
    return `Processing: ${data}`;
}
console.log(processData(null)); // "No data"
console.log(processData("test")); // Processing: test

function processDataWithIIFE(data) {
    // IIFE로 스코프 만들기 시도
    (function() {
        if (!data) {
            return "No data"; // IIFE 함수만 종료
        }
        console.log("Still running");
    })();

    return `Processing: ${data}`; // 항상 리턴함.
}

console.log(processData(null));
// "Still running" 출력 안됨
// "Processing: null" ← 의도와 다름!
```

```javascript
// this 바인딩 문제
var counter = { // 객체는 스코프를 생성하지 않음.
    count: 0,
    start: function() {
        (function () {
            // 일반 함수 호출
            // 렉시컬 this 바인딩이 아님.(호출 방식에 따라 this가 결정됨.)
            this.count++;
            console.log(this.count); // NaN
        })();

        console.log("Actual count:", this.count); // 0
    },
    arrowFunctionStart: function() {
        (() => {
            // 렉시컬 this 바인딩 (정의된 위치에 따라 this가 결정됨.)
            this.count++;
            console.log("Actual count:", this.count);
        })()
    }
};

counter.start();
// NaN
// Actual count: 0

counter.arrowFunctionStart();
// Actual count: 1```
```

```javascript
// break 문제

// IIFE 없이 - 정상 작동
for (var i = 0; i < 10; i++) {
    if (i === 5) {
        break;  // 루프 종료
    }
    console.log(i);
}
// 0, 1, 2, 3, 4

// IIFE로 감쌌을 때 - 에러!
for (var i = 0; i < 10; i++) {
    (function() {
        if (i === 5) {
            break;  // SyntaxError: Illegal break statement
            // break는 루프를 찾을 수 없음 (함수 경계를 넘을 수 없음)
        }
        console.log(i);
    })();
}
```

```javascript
// continue 문제

// IIFE 없이 - 정상 작동
for (var i = 0; i < 5; i++) {
    if (i === 2) {
        continue;  // 다음 반복으로
    }
    console.log(i);
}
// 0, 1, 3, 4

// IIFE로 감쌌을 때 - 에러!
for (var i = 0; i < 5; i++) {
    (function() {
        if (i === 2) {
            continue;  // SyntaxError: Illegal continue statement
        }
        console.log(i);
    })();
}
```

var와 let
----
var은 전체 함수의 속한 변수를 의미함. var 키워드로 생성한 변수는 사용된 위치와 관계없이 가장 가깝게 감싼 함수 스코프에 등록됨.   
let는 블록 스코프에 등록됨. 각 키워드 별로 변수를 최소한으로 노출시키면서 알맞게 사용되어야 함.

아래는 예시 코드임.
```javascript
// for 블록에 var 키워드로 i를 선언한 경우

var funcs = [];

// [[outerEnv]] 슬롯을 통해 Global LE 참조
for (var i = 0; i < 3; i++) {
    // 
    let x = i * 10;
    
    funcs.push(function() {
        // Mutable variable is accessible from closure
        console.log(i, x);
    });
}

funcs[0]();  // 3 0
funcs[1]();  // 3 10
funcs[2]();  // 3 20
```
```text
Global Execution Context
    - Global Lexical Environment
        - Environment Record
            - i
    - Lexical Environment (Per-Iteration)
        - Environment Record
            - Empty (for-loop head)
        - [[OuterEnv]]
    - Lexical Environment (Block)
        - Environment Record
            - x (for-loop body)
        - [[OuterEnv]]
```
위 코드는 for 블록에 var 키워드로 i를 선언한 경우임.   
이 경우 i는 전역 스코프(Global LE)에 등록되어 모두 같은 i를 참조하게됨.

----
```javascript
// for 블록에 let 키워드로 i를 선언한 경우

var funcs = [];

for (let i = 0; i < 3; i++) {
    let x = i * 10;
    
    funcs.push(function() {
        console.log(i, x);
    });
}

// funcs 배열에 push된 함수가 i,x의 LE를 참조하고 관계를 맺고 있어 클로저임. 
funcs[0]();  // 0 0
funcs[1]();  // 1 10
funcs[2]();  // 2 20
```
```text
Global Execution Context
    - Global Lexical Environment
        - Environment Record
            - Empty
    - Lexical Environment (Per-Iteration)
        - Environment Record
            - i (for-loop head)
        - [[OuterEnv]]
    - Lexical Environment (Block)
        - Environment Record
            - x (for-loop body)
        - [[OuterEnv]]
```
위 코드는 for 블록에 let 키워드로 i를 선언한 경우임.   
이 경우 i는 Per-Iteration LE에 등록되어 루프가 생성될 때마다 새로운 LE를 생성함. 
```text
Iteration 0 -> Per-Iteration LE(0) -> Block LE(0)   
Iteration 1 -> Per-Iteration LE(1) -> Block LE(1)   
Iteration 2 -> Per-Iteration LE(2) -> Block LE(2)
```

블록 내 함수 선언 (Function Declarations In Block)
----
블록 안에 직접 함수 선언 방식으로 함수를 정의한 경우 스코프 메커니즘이 어떤 식으로 작동하는지에 대한 예시임.
```javascript
if (false) {
    function ask() {
        console.log("여기가 실행될까요?");
    }
}
ask();
```
위 코드 예시는 어떤 JS환경(Realm)에 따라서 아래와 같은 결과를 가짐
1. ask 식별자의 스코프가 if 블록 스코프로 지정되어 외부/전역 스코프에서는 사용할 수 없어 ask() 호출 시 ReferenceError 예외와 함께 호출에 실패 (ReferenceError: ask is not defined (ES6+ strict))
2. ask 식별자가 존재하긴 하지만 if 구문이 실행되지 않아 정의가 이루어지지 않았기 때문에 ask는 호출 가능한 함수가 아니여서 호출 시 TypeError와 함께 호출 실패 (TypeError: ask is not a function (ES6+ non-strict))
3. 문제없이 호출되어 "여기가 실행될까요?" 출력 (ES5 이전 환경의 non-strict)

아래는 FiB의 예시임
```javascript
if (typeof Array.isArray != "undefined") {
    function isArray(a) {
        return Array.isArray(a);
    }
} else {
    function isArray(a) {
        return Object.prototype.toString.call(a) == "[object Array]";
    }
}
```
위 코드에서처럼 if-else 블록에 함수를 정의하면 함수를 호출할 때마다 조건을 검사하지 않아도 typeof Array.isArray를 한 번만 체크하면 되기 때문에 이렇게 작성하고 싶다는 유혹에 빠질 수 있음.   
그러나, FiB 패턴으로 코드를 작성하면 브라우저 환경에 따라 결과가 달라 혼동을 준다는 문제 외에도 디버깅이 어려워지는 문제가 생김.   
그러므로 함수를 블록에서 선언하는 것을 피하는게 좋음. 

단 필요에 따라 아래 예제와 같이 표현식은 괜찮을 수 있음
```javascript
var isArray = function isArray(a) {
    return Array.isArray(a);
}

if (typeof Array.isArray == "undefined") {
    isArray = function isArray(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
    }
}
```