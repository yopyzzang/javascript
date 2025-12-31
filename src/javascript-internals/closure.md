클로저 (Closure)
====
클로저란 함수가 정의된 스코프가 아닌 다른 스코프에서 함수가 실행되더라도, 스코프 밖에 있는 변수를 기억하고 이 외부 변수에 계속 접근할 수 있는 경우를 의미함.   
특징으로 JS 에서 함수는 자연스럽게 클로저가 되고, 직접 클로저를 보고 싶으면 함수를 해당 함수가 정의된 스코프가 아닌 다른 스코프에서 실행해야함.   
아래는 클로저의 예시임.
```javascript
function outer() {
    const x = 1
    return function inner() {
        console.log(x);
    }
}

const returned = outer();
console.dir(returned); // JS 객체의 모든 속성을 콘솔에서 볼 수 있는 방법
```
inner() 함수가 실행될 때 변수 접근 순서는 아래와 같음.   
1. 자기 자신의 환경 레코드(Environment Record) 확인
2. 없으면 outer 클로저 환경 확인 (여기서 x를 찾게됨.)
3. 클로저 환경에서도 없으면 스크립트/전역 환경에서 확인

위와 같은 과정을 거쳐 스코프 체인(Scope Chain)이 형성된다.
아래는 console.dir(returned) 결과임
```text
함수가 생성될 때 함수의 외부 환경을 참조하도록 도와주는 내부 슬롯이 존재함.
명세상으로는 [[Environment]] 로 정의되어있지만, 크롬에서는 [[Scope]]라는 이름으로 보여줌

[[Scopes]]:
  0: Closure (outer) {x: 1} (이것이 클로저임)
  1: Script {returned: ƒ}
  2: Global {window, document, ...}
```

어휘적 환경(Lexical Environment)
----
JS 엔진이 어떤 변수를 어디서 찾을지 결정하고, 그 기록을 담고 있는 저장소 역할을 함.
실제 구성은 아래와 같음.   
1. Environment Record(환경 레코드) -> 실제 변수/함수 저장소
2. Outer Environment Reference -> 부모 스코프(외부 환경)를 참조