/**
 * @param start 시작하는 지점
 * @param end 끝나는 지점
 * @description 두 개의 숫자 인자를 받고, 두 숫자는 각각 원하는 범위의 시작과 끝을 나타냄. 두 번째 인자가 없는 경우에는 두 번쨰 인자를 넘길 수 있도록 하는 함수가 반환되어야함.
 **/
function range(start, end) {
    if (typeof end === 'number') {
        return generateRange(start, end);
    }

    return function (end) {
        return generateRange(start, end);
    }
}

function generateRange(start, end) {
    let result = [];

    for (let i = 0; i <= Math.abs(start - end); i++) {
        if (end) {
            result.push(start + i);
        }
    }
    return result;
}

range(3,3);
range(3,8);
range(3,0);

// range 함수의 start 인자가 클로저
var start3 = range(3);
var start4 = range(4);

start3(3);
start3(8);
start3(0);

start4(6);