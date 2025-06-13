import type Die from "./Die"

class DiceGroup {
    key: string
    dice: Array<Die>

    constructor(key: string, dice: Array<Die>) {
        this.key = key
        this.dice = dice
    }

    sum(): number {
        const diceValues = this.getDiceValues()
        return diceValues.reduce((sum, dieValue) => sum + dieValue)
    }

    keepHighest(): number {
        return Math.max(...this.getDiceValues())
    }

    keepLowest(): number {
        return Math.min(...this.getDiceValues())
    }

    display(displayState: string): number {
        switch (displayState) {
            case '+':
                return this.sum()
                break;
            case 'kh':
                return this.keepHighest()
                break;
            case 'kl':
                return this.keepLowest()
                break;
            default:
                return this.sum()
                break;
        }
    }

    getDiceValues(): Array<number> {
        return this.dice.map(die => die.dieValue ? die.dieValue : 0)
    }
}

export default DiceGroup