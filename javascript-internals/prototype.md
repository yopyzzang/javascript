프로토타입 (Prototype)
====
JS에서는 어떤 객체가 자신의 프로퍼티를 찾지 못했을 때, 참조할 다름 객체를 가르키는 내부 링크가 존재함.   
해당 내부 링크가 [[Prototype]] 슬롯임 (접근 문법은 \__proto__)   
아래 예시는 오브젝트 리터럴로 생성한 변수의 예시임.  
```javascript
const array = [1,2,3];

console.log(array.toString()); // 1,2,3
```
위 예제에서는 배열 리터럴을 사용하여 변수를 선언하고, array에서 정의한 적 없는 toString() 함수를 호출하는데 정상적으로 결과 값이 출력됨.   
값이 정상적으로 출력되는 이유는 JS 엔진에서 아래와 같은 탐색 경로를 가지기 때문임.   
1. array 자신에게 toString()이 있는가?
2. 없으면 array.[[Prototype]]으로 이동
3. 거기에도 없는 경우 그 프로토타입의 [[Prototype]] 탐색
4. null 일 때 까지 반복 (위임 단계에서 null을 끝으로 표현)

객체와 객체로 이어진 위와 같은 탐색 경로를 프로토타입 체인(Prototype Chain)이라고 함.   
JS에서는 객체를 생성할 때 해당 객체의 원형(prototype)을 참조하여 탐색할 수 있도록 하기 때문에 위와 같은 예제가 가능함.   

아래는 실제 원형이 되는 프로토타입을 직접 정의하는 예제임.
```javascript
const phone = {
    brand: 'apple'
}

const otherPhone = Object.create(phone);
console.log(otherPhone); // {}
console.log(otherPhone.brand); // 'apple'
```
위 예제가 가능한 이유는 phone를 원형으로 Object를 생성했기 때문임.   
따라서 otherPhone의 프로토타입은 phone가 되어 실제로 otherPhone에 brand 프로퍼티가 없어도 프로토타입에 phone이 참조되어 있기 때문에 탐색 과정에서 값을 찾을 수 있게 됨.