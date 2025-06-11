class Die {
    key: string
    dieSides: number
    dieValue?: number

    constructor(key: string, dieSides: number, dieValue?: number) {
        this.key = key
        this.dieSides = dieSides
        this.dieValue = dieValue || 1
    }

    roll(): number {
        const rollVal = 1
        this.dieValue = rollVal

        return rollVal
    }
}

export default Die