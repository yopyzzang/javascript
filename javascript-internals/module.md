모듈
====
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
