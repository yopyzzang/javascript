자바스크립트 기본 개념
====
TC39(기술 운영 위원회)에서 공식 명세를 관리하며,    
합의된 변경 사항을 국제 표준화 기구인 ECMA에 제출함.

해당 명세는 JS가 추상 머신 위에서 작동한다는 전제로 작성되어있음.  
실제로 구현된 엔진은 명세를 준수하여 구현됨. (V8, SpiderMonkey 등)

하위 호환성
----
JS는 단 한 번이라도 유효한 문법이라고 인정되면, 명세서가 변경되더라도 해당 유효성이 깨지지 않음.   
이를 통해, 브라우저 버전이 업데이트 되더라도 이전에 작성된 코드의 유효성은 유지됨.

상위 호환성
----
이전 명세를 따르는 구형 엔진에서 새로운 명세서에 추가된 문법으로 코드를 작성했을 때, JS는 상위호환성을 보장하지 않음.  
다만, HTML, CSS 와 같은 경우는 상위 호환성을 보장하지만 하위 호환성을 보장하지는 않음.  
HTML/CSS 는 본질적으로 선언적이기 때문에 상위 호환성을 보장하기 쉬우나,  
JS의 경우 엔진이 이해할 수 없는 구문이나 표현식을 선택적으로 건너뛰어버리면 건너뛴 부분으로 인해 프로그램에 문제가 생길 수 있기 때문에 상위 호환성을 보장하기 어려움.

트랜스파일(Transpile)
----
JS는 상위 호환성을 보장하지 않기 때문에 오래된 엔진에서 유효한 문법으로 작성된 코드가 작동하지 않을 가능성이 있음.   
그렇기 때문에 오래된 엔진과 호환되지 않는 문법은 트랜스파일러(Babel 등)을 통해 새로운 문법을 오래된 문법으로 변환하여 대응할 수 있음.

아래는 트랜스파일러 작동 예시임.
```javascript
if (something) {
    let x = 1;
    console.log(x);
} else {
    let x = 2;
    console.log(x);
}
```
```javascript
var x$0, x$1;
if (something) {
    x$0 = 1;
    console.log(x$0);
} else {
    x$1 = 2;
    console.log(x$1);
}
```
폴리필(Polyfill)
----
상위 호환성 문제가 새로운 **문법**이 아닌 근래에 추가되었지만, 아직 지원하지 않는 **API 메서드(기능)** 때문에 발생한다면 메서드 정의를 추가해 이미 오래된 환경에서도 있었던 것 처럼 만들어주는 패턴을 말함.  

아래는 폴리필 구현 예시임.  
예시에서는 ES2019의 Promise prototype에 추가된 finally() 메서드를 지원하지 않는 경우를 상정함.
```javascript
// Promise 를 반환한다고 가정.
let promise = getSomething();

// 데이터를 가져오는 동안 스피너 노출.
startSpinner(); 

promise
    .then(renderSomething)
    .catch(showError)
    .finally(sideSpinner)
```
```javascript
if (!Promise.prototype.finally) {
    Promise.prototype.finally = function f(fn) {
        return this.then(
            function t(v) {
                return Promise.resolve(fn()).then(function t(){
                    return v;
                });
            },
            function c(e) {
                return Promise.resolve(fn()).then(function t() {
                    throw e;
                })
            }
        )
    }
}
```
