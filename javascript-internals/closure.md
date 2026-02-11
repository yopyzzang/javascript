클로저 (Closure)
====
클로저란 함수가 자신의 외부 렉시컬 환경을 기억하고, 외부 함수가 종료된 후에도 그 환경에 접근할 수 있는 것을 의미함.   

아래는 클로저의 예시임.
```javascript
function outer() {
    const x = 1
    return function inner() {
        console.log(x);
    }
}

const returned = outer();
returned(); // 1
console.dir(returned); // JS 객체의 모든 속성을 콘솔에서 볼 수 있는 방법
```
아래는 클로저의 작동 방식을 엔진 관점에서 풀어서 정리한 내용임.
```text
Global Execution Context (EC_global)   

Creation Phase:
- Lexical Environment (LE_global)
    - Environment Record
        - outer → FunctionObject ([[Environment]] → LE_global)
        - returned → <uninitialized> (TDZ)
    - [[Outer]] → null

Execution Phase:
- const returned = outer();
    - outer 함수 평가 -> outer 함수 객체 찾기 (LE_global)
    - outer 함수 호출
        - Execution Context (EC_outer) 생성 (PrepareForOrdinaryCall)
        - Creation Phase
            - Lexical Environment (LE_outer)
                - Environment Record
                    - x -> <uninitialized> (TDZ)
                    - inner -> FunctionObject ([[Environment]] -> LE_outer)
                - [[Outer]] -> LE_global
        - Execution Phase
            - const x = 1 실행 (LE_outer -> ER -> x -> 1)
            - return inner 평가 (LE_outer -> ER -> inner (FunctionObject ([[Environment]] -> LE_outer))
            - EC_outer 종료 (Call Stack 에서 제거(EC_outer pop), inner 함수가 LE_outer 참조하기 때문에 LE_outer는 메모리 유지하여 클로저 형성)
    - 반환값 inner를 returned에 할당
    
- returned();
    - Execution Context (EC_inner) 생성
    - Creation Phase
        - Lexical Environment (LE_inner)
            - Environment Record
                - Empty
        - [[Outer]] -> LE_outer (inner.[[Environment]])
    - Execution Phase
        - console.log(x); 실행
            - LE_inner ER 확인 → 없음
            - Outer (LE_outer) -> x -> 1
```
추가적으로 클로저는 복제본을 스냅숏한 데이터가 아닌, 메모리를 위치를 직접 가르키는 라이브 링크이다.   
외부 함수가 끝난 후에도 외부 함수의 렉시컬 환경을 참조하는 경우, 메모리에는 함수의 Lexical Environment가 남아있기 때문에 값을 변경하면 변경 즉시 값이 반영됨.

클로저가 아닌 경우
----
아래는 클로저가 아닌 경우의 예시임.
```javascript
function say(myName) {
    var greeting = "hi";
    output();

    function output() {
        console.log(`${greeting} ${myName}`);
    }
}

say("yopy");
```
```text
Global Execution Context (EC_global)   

Creation Phase:
- Lexical Environment (LE_global)
    - Environment Record
        - say → FunctionObject ([[Environment]] → LE_global)
    - [[Outer]] → null

Execution Phase:
- say("yopy");
    - say 함수 평가 -> say 함수 객체 찾기 (LE_global)
    - say 함수 호출
        - Execution Context (EC_say) 생성 (PrepareForOrdinaryCall)
        - Creation Phase
            - Lexical Environment (LE_say)
                - Environment Record
                    - myName - "yopy"
                    - greeting -> undefined
                    - output -> FunctionObject ([[Environment]] -> LE_say)
                - [[Outer]] -> LE_global
        - Execution Phase
            - var greeting = 'hi' 실행 (LE_outer -> ER -> greeting -> 'hi')
            - output();
                - Execution Context (EC_output) 생성
                - Creation Phase
                    - Lexical Environment (LE_output)
                        - Environment Record
                            - Empty
                    - [[Outer]] -> LE_say (say.[[Environment]])
                - Execution Phase
                    - console.log(`${greeting} ${myName}`); 실행
                        - LE_output ER 확인 → 없음
                        - Outer (LE_say) -> greeting + myName -> hi yopy
                        - EC_output 종료 (Call Stack 에서 제거 (EC_output pop))
            - EC_say 종료 (Call Stack 에서 제거 (EC_say pop))
```
즉 위 예제에서는 내부 함수(output)가 외부 함수(say)가 종료되기 전에 먼저 종료되고 외부 함수 밖으로 탈출하지 않기 때문에,   
외부 함수의 렉시컬 환경(LE_say)을 참조하는 것이 아무것도 남지 않음.   
따라서 LE_say는 GC 대상이 되어 메모리에서 제거됨.


어휘적 환경(Lexical Environment)
----
JS 엔진이 어떤 변수를 어디서 찾을지 결정하고, 그 기록을 담고 있는 저장소 역할을 함.   
어휘적 환경은 실제 실행되는 위치(컨텍스트)와는 관련없이 코드가 정의된 위치에 따라 결정된다.

실제 구성은 아래와 같음.   
1. Environment Record(환경 레코드) -> 실제 변수/함수 저장소
2. Outer Environment Reference -> 부모 스코프(외부 환경)를 참조