클로저 (Closure)
====
클로저란 함수가 정의된 스코프가 아닌 다른 스코프에서 함수가 실행되더라도, 스코프 밖에 있는 변수를 기억하고 이 외부 변수에 계속 접근할 수 있는 경우를 의미함.   
JS에서 함수는 자신의 렉시컬 환경을 기억하며 외부 변수를 참조하는 경우 클로저를 형성한다.

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

어휘적 환경(Lexical Environment)
----
JS 엔진이 어떤 변수를 어디서 찾을지 결정하고, 그 기록을 담고 있는 저장소 역할을 함.   
어휘적 환경은 실제 실행되는 위치(컨텍스트)와는 관련없이 코드가 정의된 위치에 따라 결정된다.

실제 구성은 아래와 같음.   
1. Environment Record(환경 레코드) -> 실제 변수/함수 저장소
2. Outer Environment Reference -> 부모 스코프(외부 환경)를 참조