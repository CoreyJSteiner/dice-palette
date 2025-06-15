import type React from "react"
import { useMemo } from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import type { Die, DiceGroup, PoolItem } from "./DiePalleteTypes"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"

type DiePoolProps = {
    dice: Array<Die>
    diceGroups: Array<DiceGroup>
    pool: PoolItem[]
    dieClickHandler: (key: string) => void
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    clearClickHandler: () => void
    resetClickHandler: () => void
    addToGroupHandler: (dieData: Die, groupKey?: string | null) => void
    createGroupHandler: (dice: Array<Die>) => void
    destroyGroupHandler: (groupKey: string) => void
    rollDiceGroupHandler: (groupKey: string) => void
}

const DiePool: React.FC<DiePoolProps> = ({
    dice = [],
    diceGroups = [],
    pool = [],
    clearClickHandler,
    resetClickHandler,
    dieClickHandler,
    dieInGroupClickHandler,
    addToGroupHandler,
    createGroupHandler,
    destroyGroupHandler,
    rollDiceGroupHandler
}) => {

    // Memos
    const diceAndGroups: Array<PoolItem> = useMemo(() => [
        ...diceGroups.map(group => ({ type: "group", details: group } as PoolItem)),
        ...dice.map(die => ({ type: "die", details: die } as PoolItem))
    ], [dice, diceGroups])

    // Handlers
    const handleDragEnd = (event: DragEndEvent) => {
        console.log(pool)

        const { active, over } = event

        const dieData = active.data.current as Die
        const targetData: PoolItem | undefined = over ? over.data.current as PoolItem : undefined

        console.dir(dieData)
        console.dir(targetData)
        // Escape conditions
        if (dieData.key === targetData?.details.key
            || (targetData?.type === 'die' && dieData.groupKey && dieData.groupKey === targetData?.details.groupKey)
            || (targetData?.type === 'group' && dieData.groupKey && dieData.groupKey === targetData?.details.key)) return

        if (!targetData) {
            console.log('target null => removeGroup')
            addToGroupHandler(dieData, null)
        } else if (targetData.type === 'group' || (targetData.type === 'die' && targetData.details.groupKey)) {
            console.log('target die && groupKey || target group => add to existing Group')
            addToGroupHandler(
                dieData,
                targetData.type === 'die' ? targetData.details.groupKey : targetData.details.key
            )
        } else if (targetData.type === 'die' && !dieData.groupKey) {
            console.log('target die && no groupKey => create new Group')
            createGroupHandler([dieData, targetData.details])
        }
    }

    return (
        <div className="die-pool-container">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="die-pool">
                    {diceAndGroups.map(poolItem => {
                        if (poolItem.type === 'group') {
                            return <DiceGroupDisplay
                                key={poolItem.details.key}
                                diceGroup={poolItem.details}
                                dieInGroupClickHandler={dieInGroupClickHandler}
                                destroyGroupHandler={destroyGroupHandler}
                                rollDiceGroupHandler={rollDiceGroupHandler}
                            />
                        } else {
                            return <DieDisplay
                                key={poolItem.details.key}
                                die={poolItem.details}
                                dieClickHandler={dieClickHandler}
                            />
                        }
                    })}
                </div>

                <div className="button-bottom-container">
                    <button className="button-bottom" onClick={resetClickHandler}>Reset Dice</button>
                    <button className="button-bottom" onClick={clearClickHandler}>Clear Palette</button>
                </div>
            </DndContext>
        </div >
    )
}

export default DiePool