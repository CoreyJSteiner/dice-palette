export type PoolItem =
    | { type: "die"; details: Die }
    | { type: "group"; details: DiceGroup }

export type DiceGroup = {
    key: string
    dice: Array<Die>
}

export type Die = {
    key: string
    dieSides: number
    dieValue?: number | null
    groupKey?: string | null
}