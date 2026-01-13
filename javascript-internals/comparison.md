강제 조건부 비교(Coercive Conditional Comparison)
====
조건부 표현식은 조건에 맞는지 아닌지를 판단하는데에 있어, 강제 변환을 선행함.   
if와 삼항 조건부 연산자, while, for 반복문의 조건절은 강제 조건부 비교를 수행함.   
강제 조건부 비교는 타입이 같은지 확인하는 엄격(strict) 비교와 강제로 타입을 전환해 비교하는 방식 모두 사용함.   
아래는 강제 조건부 비교의 예시임.
```javascript
var x = "안녕하세요";

if (x) {
    // 코드가 실행됨.
    console.log('isTrue?');
}

while (x) {
    // 코드가 한 번만 실행됨.
    console.log('isTrue?');
    x = false;
}

// 조건부 표현식은 내부적으로 Boolean으로 변환됨.
var x = "안녕하세요";

if (Boolean(x)) {
    // 코드가 실행됨.
    console.log('isTrue?');
}

while (Boolean(x)) {
    // 코드가 한 번만 실행됨.
    console.log('isTrue?');
    x = false;
}
```