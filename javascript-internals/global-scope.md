전역 스코프
----
JS에서는 파일 여러 개가 모여 애플리케이션이 만들어지는데, 아래 방법들과 같이 분리된 여러 개의 파일을 실행 시점에 하나로 연결함.

별도의 모듈 번들러를 사용하지 않고 ES모듈을 바로 사용하는 경우에는 파일을 각자 하나씩 로딩하고, 로딩이 완료되었을 때 import 문에 있는 다른 모듈을 참조함. 이때 각 모듈은 서로의 스코프를 공유하지 않고 베타적으로 협력함.
```javascript
// database.js
let connection = null; // private - 외부에서 직접 접근할 수 없음.

function connect() {
    connection = { status: "connected" };
}

export function disconnect() {
    connection = null;
}
```
```javascript
// cache.js
const cache = new Map(); // private - 외부에서 직접 접근 불가

export function set(key, value) {
    cache.set(key, value);
}

export function get(key) {
    return cache.get(key);
}

export function clear() {
    cache.clear();
}
```
```javascript
// app.js

// import는 참조만 가져옴.
import { query, disconnect } from './database.js'; // query = database_scope.__exports__.query, disconnect = database_scope.__exports__.disconnect 
import { set as cacheSet, get as cacheGet } from './cache.js';

// export된 함수들 사용 가능
query("SELECT * FROM users");
cacheSet("user:1", { name: "Alice" });

// 내부 변수에는 접근 불가
// connection = null;  // ReferenceError
// cache.clear();      // 이건 가능 (export됨)
// cache.set(...);     // ReferenceError (cache 변수는 private)
```
**"배타적으로 협력"의 의미:**
```
배타적 (스코프 격리):
- 각 모듈은 독립적인 스코프를 가짐
- 다른 모듈의 내부 변수에 접근 불가
- 같은 이름의 변수도 충돌 없음

협력 (명시적 공유):
- export로 명시적으로 공개한 것만 공유
- import로 필요한 것만 가져옴
- 제어된 방식으로 상호작용
```

구축 과정에 번들러가 관여하는 경우에는 파일 전체가 합쳐져 브라우저와 JS 엔진에 전달됨. 이 경우에 엔진은 하나의 커다란 파일만 처리함. 이렇게 하나의 파일에 모여 있는 경우라도 파일 내 코드 조각 일부에서 다른 코드 조각을 참조할 때 사용할 이름을 등록한다든가 하는 작업이 필요하고, 타 코드 조각에 접근할 때 적용할 메커니즘이 필요함. 예시로 파일 내용 전체를 래퍼 함수나 유니버셜 모듈을 사용해 하나의 공유되는 스코프로 묶어 식별자를 등록함.
```javascript
(function wrappingOuterScope() {
    // module-one.js
    var moduleOne = (function one() {
        // ...
    })();
    // module-two.js
    var moduleTwo = (function two() {
        // ...
        function callModuleOne() {
            moduleOne.someMethod();
        }
    })();
})();
```

모든 코드 조각을 아우르는 스코프가 없는 경우, 전역 스코프를 활용하여 식별자들을 등록함.   
개별 파일들이 공유하는 유일한 리소스는 전역 스코프이기 떄문에 각 파일의 최상위 스코프에 선언된 변수들은 전역 스코프의 전역 변수가 됨.   
전역 스코프는 여러가지 프로그램을 접착해주는 역할을 하기도하고, JS내장 기능이나 DOM 같은 특정 호스팅 환경에서 제공하는 내장 기능을 사용할 때도 사용됨. 
```javascript
// module-one.js
var moduleOne = (function one() {
        // ...
})();
// module-two.js
var moduleTwo = (function two() {
    // ...
    function callModuleOne() {
        moduleOne.someMethod();
    }
})();
```
