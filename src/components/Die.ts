class Die {
    key: string
    dieSides: number
    dieValue?: number
    groupKey?: string | null

    constructor(
        key: string,
        dieSides: number,
        dieValue?: number,
        groupKey?: string | null,
    ) {
        this.key = key
        this.dieSides = dieSides
        this.dieValue = dieValue
        this.groupKey = groupKey
    }

    roll(): number {
        const rollVal = Math.floor(Math.random() * this.dieSides + 1)
        this.dieValue = rollVal
        console.log(`d${this.dieSides}-${this.key}-${this.groupKey}: ${rollVal}`)

        return rollVal
    }
}

export default Die