import type Die from "./Die"

class DiceGroup {
    key: string
    dice: Array<Die>

    constructor(key: string, dice: Array<Die>) {
        this.key = key
        this.dice = dice
    }

    sum() {
        const diceValues = this.dice.map(die => die.dieValue ? die.dieValue : 0)
        return diceValues.reduce((sum, dieValue) => sum + dieValue)
    }
}

export default DiceGroup