코드 구조화 패턴
====
JS에서 코드를 구조화하는 패턴은 크게 클래스와 모듈로 나뉘어짐.   
이 둘은 상호 배타적인 패턴이 아니고 쓰임새에 따라 사용함.

클래스
----
클래스는 사용자가 정의한 데이터 타입으로 데이터와 이 데이터를 조작하는 동작이 설계됨.   
단, 사용자 정의 데이터 타입이 어떻게 동작하는지 정의는 하지만 구체적인 값은 아니므로,   
프로그램에서 사용할 수 있는 구체적인 값이 필요하다면 생성자인 new 키워드를 사용하여 인스턴스를 만들어야함.   
인스턴스는 생성자 함수나 클래스에서 만들어진 실제 객체를 말함.   
아래는 클래스의 예시임.
```javascript
class Page {
    /* 인스턴스가 생성될 때 자동으로 실행되는 초기화 함수, 초기 상태(속성)를 설정할 때 쓰임.
       클래스에 constructor 메서드가 없더라도, 자바스크립트에서 자동으로 빈 constructor를 만들어줌. */
    constructor(text) {
        this.text = text;
    }
    print() {
        console.log(this.text);
    }
}

class Notebook {
    constructor() {
        this.page = [];
    }
    addPage(text) {
        var page = new Page(text);
        this.page.push(page);
    }
    
    print() {
        for (let page of this.page) {
            page.print();
        }
    }
}
// Notebook의 인스턴스 객체 생성(결과물), Notebook은 설계도와 같은 역할을 함.(function 타입을 가짐.)
var mathNotes = new Notebook();
mathNotes.addPage("기초 연산: + - * ...");
mathNotes.addPage("삼각법: sin cos tan ...");

mathNotes.print();

// 예전 방식 예시
function Person(name) {
    this.name = name;
}
var friend = new Person('요피');
console.log(friend); // 요피
```
new 생성자를 통해 인스턴스(개체)를 생성하는 과정은 아래와 같음.   
1. 빈 객체 생성 -> { }
2. 그 객체의 [[Prototype]]을 Notebook.prototype으로 설정
3. this를 방금 만든 객체로 바인딩
4. 함수 실행
5. 객체 반환

아래는 메서드를 prototype에 넣는 이유를 나타낸 예시임.
```javascript
class Pet {
    constructor(name) {
        this.name = name; // 인스턴스에 할당됨.
    }
    
    // 자동으로 prototype에 할당.
    sayHello() {
        console.log(`안녕 ${this.name}`);
    }
}
// 가변적인 데이터이므로 멤버 변수는 인스턴스에 넣음.
const p1 = new Pet('요피');
const p2 = new Pet('로리');

// 메서드는 메모리 절약하면서 모든 인스턴스가 같은 메서드를 공유하기 위해 프로토타입에 할당함.
if (p1.sayHello === p2.sayHello) {
    p1.sayHello(); // 안녕 요피
    p2.sayHello(); // 안녕 로리
}
```
실제로 자바스크립트에서 프로토타입에 할당된 메서드를 실행할 때는 아래와 같은 순서를 가짐.
1. p1 객체에 sayHello가 있는지 확인
2. 없으면 [[prototype]]으로 이동
3. Pet.prototype에서 sayHello 발견
4. 해당 함수를 실행 (this = p1)

상속
----
클래스 지향 설계는 JS에서 잘 사용하지 않지만 상속(inheritance)과 다형성(polymorphism)을 빼놓고 설명할 수 없음.   
아래는 상속과 다형성에 대한 예시임.
```javascript
class Publication {
    constructor(title, author, pubDate) {
        this.title = title;
        this.author = author;
        this.pubDate = pubDate;
    }

    print() {
        console.log(`
            제목: ${this.title},
            저자: ${this.author},
            발행일: ${this.pubDate}
            `);
    }
}
class Book extends Publication {
    constructor(bookDetails) {
        super(
            bookDetails.title,
            bookDetails.author,
            bookDetails.publishedOn
        );
        this.publisher = bookDetails.publisher;
        this.ISBN = bookDetails.ISBN;
    }

    print() {
        super.print();
        console.log(`
        출판사: ${this.publisher}
        ISBN: ${this.ISBN}
        `);
    }
}

class BlogPost extends Publication {
    constructor(title, author, pubDate, URL) {
        super(title, author, pubDate);
        this.URL = URL;
    }

    print() {
        super.print();
        console.log(`URL: ${this.URL}`);
    }
}
var YDKJSY = new Book({
    title: "You Don't Know JS Yet",
    author: "카일 심슨",
    publishedOn: "2020년 1월",
    publisher: "독립 출판",
    ISBN: "979-8602477429"
});
YDKJSY.print();

var forAgainstLet = new BlogPost(
    "For and against let",
    "카일 심슨",
    "2024년 10월 27일",
    "https://davidwalsh.name/for-and-against-let"
);

forAgainstLet.print();
```
Book과 BlogPost 클래스 모두 extends 키워드를 사용하여 Publication 클래스에서 정의한 동작을 확장하여 사용함.   
각 클래스 생성자 안에 있는 super() 메서드는 부모 클래스인 Publication의 생성자를 자식 클래스에서도 사용할 수 있도록 동일한 작업을 하는 코드를 다시 작성하지 않아도 출판 타입에 맞게 초기화 할 수 있도록 함.  

자식 클래스를 사용한 예시에서는 두 자식 클래스의 인스턴스를 통해 부모 클래스인 Publication에서 상속받아 새롭게 재정의(override)한 메서드인 print()를 호출 가능함.   
각 자식 클래스에 정의한 print() 메서드는 super.print()가 호출되면서 부모 클래스에서 정의한 print() 메서드를 상속받아 사용함.   
이렇게 상속받은 메서드와 새롭게 정의한 메서드의 이름이 서로 동일하고 공존할 수 있는 것을 다형성이라고 함.