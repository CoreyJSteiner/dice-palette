import type Die from "./Die"

class DiceGroup {
    key: string
    dice: Array<Die>

    constructor(key: string, dice: Array<Die>) {
        this.key = key
        this.dice = dice
    }
}

export default DiceGroup