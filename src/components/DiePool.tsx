import type React from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import type { Die, PoolItem } from "./DiePalleteTypes"
import { DndContext } from "@dnd-kit/core"
import type { DragOverEvent, DragEndEvent } from "@dnd-kit/core"
import { useState, useRef } from "react"

type DiePoolProps = {
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
    const [nestingTargetKey, setNestingTargetKey] = useState<string>('')
    const hoverTimeout = useRef<number>(undefined)

    // Handlers
    const handleDragStart = () => {
        console.log('dragstart')

        setNestingTargetKey('')
        clearTimeout(hoverTimeout.current)
    }

    const handleDragOver = (e: DragOverEvent) => {
        if (!e.over) return
        const hoverItemKey: string = e.over.id as string
        if (hoverItemKey !== nestingTargetKey) {
            clearTimeout(hoverTimeout.current)

            hoverTimeout.current = setTimeout(() => {
                setNestingTargetKey(hoverItemKey)
            }, 500)
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        console.log('dragend')

        clearTimeout(hoverTimeout.current)
        const { active, over } = e
        const dieData = active.data.current as Die
        const targetData: PoolItem | null = over ? over.data.current as PoolItem : null

        if (nestingTargetKey) {
            if (dieData.key === targetData?.id
                || (dieData.groupKey && targetData?.type === 'die' && dieData.groupKey === targetData?.details.groupKey)
                || (targetData?.type === 'group' && dieData.groupKey && dieData.groupKey === targetData?.details.key)) return

            if (!targetData || (targetData.type === 'die' && dieData.groupKey && !targetData.details.groupKey)) {
                addToGroupHandler(dieData, null)
            } else if (targetData.type === 'group' || (targetData.type === 'die' && targetData.details.groupKey)) {
                addToGroupHandler(
                    dieData,
                    targetData.type === 'die' ? targetData.details.groupKey : targetData.details.key
                )
            } else if (targetData.type === 'die' && !dieData.groupKey) {
                createGroupHandler([dieData, targetData.details])
            }
        } else if (over) {
            // Sort
            console.log('sort')
        }
    }

    return (
        <div className="die-pool-container">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                <div className="die-pool">
                    {pool.map(poolItem => {
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