모듈
====
모듈이란 관련된 데이터와 함수의 모음임.   
모듈 패턴은 클래스와 마찬가지로 논리적 단위 기준으로 데이터와 행동을 그룹화하여 재사용함.   

클래식 모듈
----
ES6 이전에는 자체적으로 모듈 패턴을 만들어 사용했음.   
클래식 모듈의 주요 특징은 최소 한 번 이상 실행되는 외부 함수라는 것인데, 이 외부 함수는 모듈 인스턴스 내부의 숨겨진 데이터를 대상으로 작동하는 함수가 있는 인스턴스를 반환함.   
이는 단순한 함수이기도 하고 함수를 호출하면 모듈 인스턴스가 생성되기 때문에 클래식 모듈 인스턴스에 있는 함수를 모듈 팩토리라고도 설명함.   
아래는 클래스 문법에서 사용한 예시를 클래식 모듈 형태로 만든 예제임.
```javascript
function Publication(title, author, pubDate) {
    var publicAPI = {
        print() {
            console.log(`
            제목: ${this.title},
            저자: ${this.author},
            발행일: ${this.pubDate}
            `);
        }
    }
    return publicAPI
}

function Book(bookDetails) {
    var pub = Publication(
        bookDetails.title,
        bookDetails.author,
        bookDetails.publishedOn
    );
    
    var publicAPI = {
        print() {
            pub.print();
            console.log(`
                출판사: ${bookDetails.publisher}
                ISBN: ${bookDetails.ISBN}
            `)
        }
    };
    
    return publicAPI;
}

function BlogPost(title, author, pubDate, URL) {
    var pub = Publication(title, author, pubDate);
    
    var publicAPI = {
        print() {
            pub.print();
            console.log(URL);
        }
    }
    
    return publicAPI;
}
```
클래스는 메서드와 데이터를 new 키워드를 통해 생성한 객체 인스턴스에 저장하며, 클래스 내부에서 메서드와 데이터에 접근하려면 this 접두사를 사용해야함.   
반면 모듈에서는 this 없이도 스코프 내 식별자 역할을 하는 변수를 사용해 메서드와 데이터에 접근할 수 있음.  

또한, 클래스에서는 인스턴스의 API가 클래스 자체에 정의되어 있고, 모든 데이터와 메서드가 공개되어있어 인스턴스 외부에서 직접 접근할 수 있음.   
반면 모듈 팩토리 함수에서는 외부에 노출된 공개 메서드를 사용하여 객체를 명시적으로 만들고 반환하기 때문에 데이터나 참조되지 않은 메서드는 비공개로 남음.

ES 모듈
----
ES6에서 도입된 ES 모듈(ESM)은 클래식 모듈과 같은 취지를 갖는 문법임.   
단, 구현 관점에서 ES 모듈은 클래식 모듈의 접근법에는 아래와 같은 차이가 있음.   
1. 모듈을 정의하는 래핑 함수가 없고, 모듈은 파일이라는 맥락에서 구현됨. (ES 모듈 파일 하나는 모듈 하나임)
2. 모듈 API와 직접 상호작용하지 않고 export 키워드를 통해 변수나 메서드를 퍼블릭 API로 정의함. 모듈 안에 있는 변수나 메서드의 경우라도 export 키워드가 붙지 않으면 숨김 상태로 남음
3. 모듈을 인스턴스화 하지 않아도 import 키워드를 사용해 가져오면 처음 모듈을 가져온 순간 인스턴스가 생기며, 동일한 모듈을 다른곳에서 import 할 때는 이미 생성된 모듈의 참조만 가져옴.   

아래 예시는 ES 모듈과 클래식 모듈을 합쳐놓고, 여러 인스턴스가 필요하다고 가정한 예시임.
```javascript
// publication.js
function printDetails(title, author, pubDate) {
    console.log(`
    제목: ${title}
    저자: ${author}
    발행일: ${pubDate}
    `);
}

export function create(title, author, pubDate) {
    var publicAPI = {
        print() {
            printDetails(title, author, pubDate);
        }
    };
    
    return publicAPI;
}
```
```javascript
// blogpost.js
import { create as createPub } from "publication.js";

function printDetails(pub, URL) {
    pub.print();
    console.log(URL);
}

export function create(title, author, pubDate, URL) {
    var pub = createPub(title, author, pubDate);
    
    var publicAPI = {
        print() {
            printDetails(pub, URL);
        }
    };
    
    return publicAPI;
}
```
```javascript
// main.js
import { create as newBlogPost } from "blogpost.js";

var forAgainstLet = newBlogPost(
    "For and against let",
    "카일 심슨",
    "2014년 10월 27일",
    "https://davidwalsh.name/for-and-against-let"
);

forAgainstLet.print();
```
ES 모듈은 기본적으로 단일 인스턴스이지만, 모듈 내부에 클래식 모듈을 함께 사용하면 모듈 인스턴스를 여러 개 생성할 수 있음.   
위 예제에서는 모듈 팩토리 함수인 create()를 사용하여 인스턴스를 여러 개 생성함.  
추가적으로 import를 사용하여 모듈을 불러와 실행한 경우, 모듈 범위(module-wide) 스코프에 변수가 생성되고, 최상위 레벨(전역 스코프)의 선언을 지원하지 않음.

네임스페이스(무상태 그룹화)
----
데이터 없이 관련된 함수를 그룹으로 묶는 것은 모듈에서 이야기하는 캡슐화가 아님.   
이러한 무상태(stateless) 함수를 모아놓은 것을 네임스페이스(namespace)라고 함.

아래는 네임스페이스의 예시임.
```javascript
var Utils = {
    cancelEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    },
    wait(ms) {
        return new Promise(function (res) {setTimeout(res,ms)})
    },
    isValidEmail(email) {
        return /[^@]+@[^@.]+\.[^@.]+/.test(email)
    }
};
```
위 예시는 모두 상태 독립적인(state-independent) 함수, Utils는 함수를 체계화한 네임스페이스임.

데이터 구조(상태 유지 그룹화)
----
데이터와 상태를 가진 함수를 하나로 묶는다 하더라도 데이터의 가시성을 제한하지 않는다면 POLE 관점에서 캡슐화가 아님.   
이런 경우는 모듈이라는 이름이 적절하지 않음.

아래는 데이터 구조의 예시임.
```javascript
var Pet = {
    records: [
        { id: 14, name: "yopy", grade: 99 },
        { id: 15, name: "bobby", grade: 99 },
        { id: 16, name: "nabi", grade: 99 },
        { id: 17, name: "rori", grade: 99 },
    ],
    getName(petID) {
        var pet = this.records.find(pet => pet.id === petID);
        return pet.name;
    }
}

Pet.getName(14); // yopy
```
위 예시는 records 프로퍼티를 공개적으로 접근할 수 있기 때문에 Pets는 모듈이 아님.   
이런 경우는 데이터 구조의 인스턴스라는 이름을 붙이는게 나음.

모듈(상태를 가진 접근 제어)
----
모듈 패턴이 가진 의미는 함수를 그룹화하는 것뿐만 아니라 가시성(은닉) 제어를 통한 통제도 필요함.   

아래 예시는 위에 데이터 구조를 모듈화한 예시임(노출식 모듈이라 불린 클래식 모듈 형식)
```javascript
var Pet = (function definePet() {
    var records = [
        { id: 14, name: "yopy", grade: 99 },
        { id: 15, name: "bobby", grade: 99 },
        { id: 16, name: "nabi", grade: 99 },
        { id: 17, name: "rori", grade: 99 },
    ];
    
    var publicAPI = {
        getName
    };
    
    return publicAPI;
    
    function getName(petID) {
        // 클로저
        var pet = records.find(pet => pet.id === petID);
        return pet.name;
    }
})();

Pet.getName(14); // yopy
```
Pet은 모듈의 인스턴스가 되고, Pet 모듈에는 records 데이터에 접근 가능한 함수인 getName 함수가 포함된 공개 API가 구현되어 있음.   
외부에서는 공개 API를 통해야 getName 함수에 접근할 수 있음.   
IIFE를 사용하는 것은 프로그램에서 해당 모듈 인스턴스 하나만 필요하다는 것을 의미함.   
이때 이 단일 인스턴스를 싱글턴(singleton)이라고 부름.

모듈 팩토리 (다중 인스턴스)
----
아래는 위 예시를 다중 인스턴스를 지원하도록 바꾼 코드임 
```javascript
function definePet() {
    var records = [
        { id: 14, name: "yopy", grade: 99 },
        { id: 15, name: "bobby", grade: 99 },
        { id: 16, name: "nabi", grade: 99 },
        { id: 17, name: "rori", grade: 99 },
    ];
    
    var publicAPI = {
        getName
    };
    
    return publicAPI;
    
    function getName(petID) {
        // 클로저
        var pet = records.find(pet => pet.id === petID);
        return pet.name;
    }
}

var pet = definePet();
pet.getName(14); // yopy
```
독립형 함수로 정의하여 모듈 팩토리 함수로 만듬.   
위 예시는 단일 인스턴스와 다르게, 각 모듈 인스턴스는 새로운 실행 컨텍스트와 렉시컬 환경을 가짐.

CommonJS (Node.js)
----
CommonJS 모듈은 파일 기반이여서 모듈을 만들 때 별도의 파일을 정의해야함.

아래는 앞 예시 코드를 CommonJS 모듈로 변환한 예시임.
```javascript
module.export.getName = getName;

var records = [
    { id: 14, name: "yopy", grade: 99 },
    { id: 15, name: "bobby", grade: 99 },
    { id: 16, name: "nabi", grade: 99 },
    { id: 17, name: "rori", grade: 99 },
];

function getName(petID) {
    var pet = records.find(pet => pet.id === petID);
    return pet.name;
}
```
기본적으로 Node.js의 모듈(파일)은 전역 스코프가 아닌 자체적으로 모듈 스코프를 가짐.   
따라서 모든 코드는 기본적으로 바깥 코드에 대해 비공개임.   
그래서 CJS에서는 module.export 객체를 사용해 모듈의 공개 API를 정의함.   

아래는 exports 객체를 사용해 여러 모듈을 내보내는 예시임.
```javascript
// 해당 방식은 여러 모듈이 순환적으로 종속되는 경우 예기치 않은 동작이 발생할 가능성이 있음. 
module.exports = {
    moduleA,
    moduleB,
    moduleC
};

// 여러 개의 모듈을 동시에 내보내려면 아래와 같은 방법을 권장함.
Object.assign(module.exports, {
    moduleA,
    moduleB,
    moduleC
});
// 모듈의 공개 API를 객체 리터럴에 정의하고 얕은 복사로 여러 속성을 한 번에 추가할 수 있음.
```
작업 중인 모듈이나 프로그램에 또 다른 모듈 인스턴스를 추가하려면 Node.js의 require() 메서드를 사용하면 됨.

아래는 require 메서드를 사용한 예시임.
```javascript
var Pet = require("/path/to/pet.js");

Pet.getName(14); // yopy
```
단 CommonJS 모듈은 IIFE 모듈 정의 방식과 유사하게 단일 인스턴스를 가짐.   
동일한 모듈을 여러 번 require 메서드를 통해 불러와도 모두 같은 모듈 인스턴스에 대한 참조를 얻음.   
추가적으로 require 함수를 통해 모듈을 불러오면 모듈 파일의 전체 공개 API가 불러와짐. 모듈의 일부분만 필요한 경우에는 아래와 같이 사용함.
```javascript
// 프로퍼티 접근
var getName = require("/path/to/pet.js").getName;

// object destructuring
var { getName } = require("/path/to/pet.js");

// Etc. Node.js 에서 require("pet")과 같이 확장자 없이 상대 경로를 넘기는 경우 확장자를 .js로 가정하고 node_module 안에서 모듈을 찾음.
var { getName } = require("pet");
```

ES 모듈
----
ES 모듈(ESM)은 CommonJS와 약간 유사함. ES 모듈은 파일 기반이고 모듈 인스턴스는 싱글턴이며 모든 것은 기본적으로 비공개임.   
ES 모듈과 CommonJs 사이 눈에 띄는 차이점은 ES 모듈은 파일 상단에 전처리 구문 use strict 가 없어도 엄격 모드로 실행된다는 점임.   

아래는 ES 모듈에서 모듈을 내보내는 예시임.
```javascript
export { getName };

var records = [
    { id: 14, name: "yopy", grade: 99 },
    { id: 15, name: "bobby", grade: 99 },
    { id: 16, name: "nabi", grade: 99 },
    { id: 17, name: "rori", grade: 99 },
];

function getName(petID) {
    var pet = records.find(pet => pet.id === petID);
    return pet.name;
}

// 함수 앞에 export 키워드를 붙혀도 내보내짐.
// 이는 기명 내보내기(named export)라고 함.
export function getName(petID) {
    ...
}
// 기명으로 내보내진 함수를 import 할 때
import { getName } from "path/to/pet.js";
getName(14); // yopy


// default 키워드를 붙혀 모듈을 노출하는 형태를 기본 내보내기라고 하는데, 일반 내보내기와는 동작이 다름,
// 내보낼 API 객체에 멤버 변수가 하나 있는 경우 기본 내보내기를 하면 간단한 문법으로 해당 모듈을 import 할 수 있음.
export default function getName(petID) {
    ...
}
// default 키워드로 내보내진 함수를 import 할 때
import getName from "path/to/pet.js";
getName(14); // yopy

// default와 기명으로 내보내진 멤버를 같이 import 하는 경우
import { default as getName, /* 기명 내보내기 한 멤버들... */ } from "path/to/pet.js"

// 네임스페이스 가져오기
import * as Pet from "/path/to/pet.js";
```

추가적으로 CommonJS와 ES 모듈 전부 실행되는 환경(Realm)이나 브라우저에서 선언되는 모듈에 따라 스코프가 달라짐.   

아래는 실행 환경 및 모듈을 불러오는 방식에 대한 차이를 담은 예제임.
```javascript
// Realm: Node.js
var x = 1; // module의 최상위 스코프에 등록.
console.log(x); // 1
console.log(global.x); // undefined

// Realm: Browser
// main.js
var x = 1;
console.log(window.x);

// ES Module
<script type="module" src="main.js"></script> // undefined

// 일반 모듈
<script src="main.js"></script> // 1
```