이터레이션
====
이터레이터(반복) 패턴(iterator pattern)은 데이터를 덩어리(chunk) 단위로 표준화된 방법을 통해 처리하는 디자인 패턴임.   
해당 접근 방식은 데이터 전체를 한꺼번에 처리하기보다 일정 단위로 쪼개고, 이 조각들을 차례대로 순회하며 점진적으로 처리하는 것이 더 효율적일 것이라는 아이디어에서 출발함.   

이터레이터 패턴에는 처리할 데이터를 참조하는 데이터 구조인 이터레이터가 정의되는데, next()라는 메서드를 지원하며 이를 호출할 때마다 관계형 데이터베이스에서 질의 결과에 해당하는 레코드나 줄과 같은 데이터 조각이 차례대로 반환됨.   
작업을 반복할 때, 데이터가 총 몇 개의 조각으로 이루어져 있는 지 사전에 알기 어렵기 때문에 데이터를 전부 처리했음에도 또 다른 작업을 시작하려고 하면 특별한 값을 사용하거나 예외를 발생시켜 반복 작업이 종료되었다는 신호를 줌.   
ES6 명세서에는 JS 내장 문법을 통해 이터레이터 패턴을 구현하는 구체적인 프로토콜이 추가되었는데, next() 메서드는 이터레이터 결과(iterator result)라고 불리는 객체를 반환함. 해당 객체에는 value와 done이라는 프로퍼티가 포함됨.   
반복 작업이 끝나지 않은 경우 done에는 boolean 값인 false가 저장되어야한다고 정의함.  

아래는 JS에서 이터레이터 예제임.
```javascript
function createIterator(items) {
    let index = 0;

    return {
        next() {
            if (index < items.length) {
                return { value: items[index++], done: false };
            }
            return { done: true };
        },

        [Symbol.iterator]() {
            return this;
        }
    };
}

const iterator = createIterator(["A", "B", "C"]);

for (var val of iterator) {
    console.log(val);
}
```
for...of 반복문을 이용하여 이터레이터 리절트 객체를 소비할 때, Symbol.iterator()을 호출하여 반환된 객체를 이터레이터로 사용함.  
JS에서는 이터러블은 문자열, 배열, 맵, 셋과 같은 자료구조나 컬렉션을 이터러블로 정의함.   
실제로 Array.prototype 객체에는 Symbol.iterator 함수가 정의되어있음.   
다만, 위 예제와 달리 실제 Array 이터러블에서는 Symbol.iterator 함수를 호출할 때마다 새로운 iterator 을 생성함.
