export type PoolItem =
    | { id: string, type: "die"; details: Die }
    | { id: string, type: "group"; details: DiceGroup }

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