/**
 * @param dayStart 근무 시작 시각
 * @param dayEnd 근무 종료 시각
 **/
const dayStart = "07:30";
const dayEnd = "17:45";

/**
 * @param startTime 회의 시작 시각
 * @param durationMinutes 회의 지속 시간
 * @description 회의가 근무 시간 내 이뤄질 경우 true를, 그렇지 않다면 false를 반환하는 함수
 **/
function scheduleMeeting(startTime, durationMinutes) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMinutes;

    return startMinutes >= timeToMinutes(dayStart) && endMinutes <= timeToMinutes(dayEnd);
}

function timeToMinutes(time) {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

/* 처음 접근 방법은 문자열을 맞춰 사전 순으로 비교한 방식, 24:00 같은 유효하지 않은 시간대가 허용되며 하루를 넘겼을 때에 대한 처리가 미흡했기 때문에 위 코드와 같이 시간을 분단위로 변환하여 계산함.
function scheduleMeeting(startTime, durationMinutes) {
    const splitStartTime = startTime.split(":");
    const durationTime = minutesToTime(Number(splitStartTime[1]) + durationMinutes);
    const meetingEndTime = formattedTime(`${Number(splitStartTime[0]) + durationTime.hours}:${String(durationTime.minutes).padStart(2,"0")}`);

    return formattedTime(startTime) >= dayStart && meetingEndTime <= dayEnd;
}

function formattedTime(time) {
    switch (time[0]) {
        case '0':
        case '1':
        case '2':
            return time
        default:
            return `0${time}`
    }
}

function minutesToTime(minutes) {
    return { hours: Math.floor(minutes / 60), minutes: minutes % 60 }
} */
