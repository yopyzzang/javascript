섀도잉 (Shadowing)
====
JS에서는 스코프 기준으로 식별자를 분류하는데, 바깥 스코프의 식별자를 안쪽 스코프에서 다른 식별자가 가리는 것을 섀도잉이라고함.   
아래는 예시임.
```javascript
// 전역 스코프
var petName = "Yopy";

// 함수 스코프에 있는 petName 매개변수가 전역 스코프에 있는 변수 petName을 섀도잉(감춤)함.
function printPetName(petName) {
    // 함수 스코프
    petName = petName.toUpperCase();
    console.log(petName);
}

printPetName("Babi"); // BABI

printPetName(petName); // YOPY

console.log(petName); // Yopy
```
해당 코드에서 printPetName 함수를 호출하기 전, 인자로 전달되는 petName은 전역 스코프에서 평가됨.

이후 함수가 호출되면 새로운 실행 컨텍스트가 생성되고, 이 실행 컨텍스트의 렉시컬 환경에 매개변수 petName이 바인딩됨.

함수 본문 실행 시 식별자 petName을 탐색하면 함수 스코프에서 이미 발견되므로 스코프 체인에 따라 전역 스코프는 탐색되지 않으며, 이로 인해 전역 스코프의 petName은 섀도잉된다.

전역 언섀도잉 (Global Unshadowing)
----
서로 다른 스코프에서 동일한 이름을 가진 식별자가 존재할 경우 탐색 범위를 스코프 단위로 제한하는 것이 섀도잉인데, 이때 전역 값을 통해 우회적으로 접근하는 방법이 있지만 혼란을 야기할 수 있으므로 권장되지 않음.
사실 책에서는 해당 방법을 전역 언섀도잉이라고 표현했지만, 실제로는 식별자 탐색을 통한 섀도잉을 해제한 것이 아닌 글로벌 객체 프로퍼티를 접근하여 우회한 것이라고 보임.   
아래는 해당 방법의 예시임.
```javascript
// 단 해당 예제는 브라우저 환경에서만 가능함.
var petName = "요피";

function printPetName(petName) {
    console.log(petName);
    console.log(window.petName); // 전역 객체를 통해 전역 값을 우회적으로 접근
}

printPetName("바비");
// 바비
// 요피


// 추가적으로 var 키워드나 function 키워드를 통한 선언만이 전역 객체에 추가됨.
var one = 1;
const two = 2;
let three = 3;
class four {}

console.log(window.one); // 1
console.log(window.two); // undefined
console.log(window.three); // undefined
console.log(window.four); // undefined
```

복사와 접근의 차이
----
아래 예시는 객체를 사용하여 접근하는 예시임.
```javascript
var speical = 42;

function lookingFor(speical) {
    var another = {
        speical: speical
    };
    const primitive = speical;
    function keepLooking() {
        var speical = 3.141592;
        console.log(speical);
        console.log(another.speical); // 객체 프로퍼티를 통해 복사된 값에 접근, 즉 새로운 컨테이너의 복사된 값에 접근하는 것이기 때문에 섀도잉 규칙이 깨진 것이 아님
        console.log(primitive); // 마찬가지로 새로 생성된 컨테이너의 복사된 값에 접근하는 것
        console.log(window.speical); // 브라우저 환경에서만 window 전역 객체 접근 가능
    }

    keepLooking();
}

lookingFor(123123123);
// 3.141592
// 123123123
// 123123123
// 42
```

금지된 섀도잉
----
모든 선언 조합이 섀도잉을 만들어 내는 것은 아님, let은 var을 가릴 수 있지만 var는 let을 가릴 수 없음.
아래는 해당 예시임.
```javascript
function something() {
    var special = "JS";
    {
        let special = 123123;
        console.log(special);
    }
}

something(); // 123123

function another() {
    // let 키워드를 통해 선언된 변수는 블록 스코프에 바인딩됨. 즉 함수 최상위 스코프에는 let special이 존재함.
    let special = "JS";
    {
        // SyntaxError: Identifier 'special' has already been declared
        // var 키워드를 통해 선언된 변수는 블록 스코프 안에 있더라도, 가장 바깥 쪽 스코프인 함수 스코프에 바인딩(호이스팅)됨. 그런데 이미 함수 최상위 스코프에 let special 이 존재하기 때문에 구문 오류가 발생함.
        var special = 123123;
        console.log(special);
    }
}
```
