function randMax(max) {
    return Math.trunc(1E9 * Math.random()) % max; // 1E9 = 1 x 10^9 (여기서의 E는 10의 지수(Exponent)를 뜻함)
}

/**
 * @description 슬롯 머신에 들어가는 릴에 대한 동작이 정의되어 있는 객체
 **/
const reel = {
    symbols: [
        "가", "나", "다", "라", "마", "바", "사", "아"
    ],
    /**
     * @memberOf reel
     * @description 릴을 회전시켜 현재 위치를 무작위로 변경한다.
     * - 초기 위치가 없으면 랜덤 위치로 초기화된다.
     * - 이후 현재 위치에서 랜덤한 만큼 이동한다.
     **/
    spin() {
        if (this.position == null) {
            this.position = randMax(this.symbols.length - 1);
        }
        this.position = (this.position + 100 + randMax(100)) % this.symbols.length;
    },
    /**
     * @memberOf reel
     * @description 현재 릴의 심볼을 반환한다.
     * - 초기 위치가 없으면 랜덤 위치로 초기화된다.
     **/
    display() {
        if (this.position == null) {
            this.position = randMax(this.symbols.length - 1);
        }
        return this.symbols[this.position];
    }
}

const slotMachine = {
    reels: [
        Object.create(reel),
        Object.create(reel),
        Object.create(reel),
    ],
    spin() {
        this.reels.forEach(function spinReel(reel) {
            reel.spin();
        });
    },
    display() {
        let previousReels = [];
        let nextReels = [];
        let result = [];

        this.reels.forEach(function displayReel(reel) {
            previousReels.push(reel.symbols[reel.position - 1] ?? reel.symbols[reel.symbols.length - 1]);
            result.push(reel.symbols[reel.position]);
            nextReels.push(reel.symbols[reel.position + 1] ?? reel.symbols[0]);
        });

        console.log(previousReels);
        console.log(result);
        console.log(nextReels);
    }
}

slotMachine.spin();
slotMachine.display();

slotMachine.spin();
slotMachine.display();
