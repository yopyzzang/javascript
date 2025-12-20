변수
====
JS에서 값은 리터럴 값으로 표현하거나 변수에 담긴 채로 다룸, 변수는 값을 담을 수 있는 상자의 개념임.   
변수를 사용하려면 먼저 변수 선언(생성)이 선행됨, 변수는 식별자(identifier)라고도 하는데,   
아래 예시와 같이 다양한 문법으로 선언할 수 있음.   
```javascript
// var 키워드를 통해 프로그램 내에서 사용할 수 있는 변수를 정의하고 초깃값을 할당할 수 있는 변수를 선언
var name = 'yopy';
var age;
```
var 키워드를 통해 선언된 변수는 접근 범위가 함수 스코프(function scope)임.
```javascript
let name = 'yopy';
let age;
```
let 키워드를 통해 선언된 변수는 접근 범위가 블록 스코프(block scope)임.
```javascript
var adult = true;

if (adult) {
    var name = 'yopy';
    let age = 20;
}

console.log(name); // 'yopy'
console.log(age); // 오류 발생
```
if 문 밖에서, if 블록 안에 var 키워드로 선언한 변수 name에 접근할 때는 오류가 발생하지 않지만,   
let 키워드로 선언한 변수 age는 유효 범위가 블록이므로 if 문 밖에서 접근하면 오류가 발생함.   
```javascript
const birthday = true;
let age = 20;

if (birthday) {
    age = age + 1; // let 키워드를 통해 변수를 선언했으므로 값 재할당이 가능함.
    birthday = false; // const 키워드를 통해 변수를 선언했으므로 값 재할당이 불가능함. (오류 발생)
}
```
const 키워드로 선언한 변수는 값 재할당이 불가능하기 때문에 간단한 원시 타입 변수를 만들 때 유용함.
```javascript
function hello(name) {
    console.log(`${name} 님, 안녕하세요.`);
}
hello("요피"); // 요피 님, 안녕하세요.
```
식별자 hello의 유효 범위는 가장 바깥 스코프이고, 함수를 참조함. 함수의 매개변수인 name은 함수 안에서 생성되므로 함수 스코프 안에서만 접근 가능함.