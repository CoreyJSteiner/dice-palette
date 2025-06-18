export type PoolItem =
    | { id: string, type: "die"; details: Die }
    | { id: string, type: "group"; details: DiceGroup }

export type PoolItemDie = { id: string, type: "die"; details: Die }

export type DiceGroup = {
    key: string
    dice: Array<Die>
}

export type Die = {
    key: string
    dieSides: number
    fillColor: string
    fontColor: string
    dieValue?: number | null
    groupKey?: string | null
}