import type React from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import Die from "./Die"
import DiceGroup from "./DiceGroup"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"

type DiePoolProps = {
    dice: Array<Die>
    diceGroups: Array<DiceGroup>
    dieClickHandler: (key: string) => void
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    clearClickHandler: () => void
    resetClickHandler: () => void
    addToGroupHandler: (dieData: Die, groupKey: string | undefined) => void
    createGroupHandler: (dice: Array<Die>) => void
    destroyGroupHandler: (groupKey: string) => void
}

const DiePool: React.FC<DiePoolProps> = ({
    dice = [],
    diceGroups = [],
    clearClickHandler,
    dieClickHandler,
    dieInGroupClickHandler,
    addToGroupHandler,
    createGroupHandler,
    destroyGroupHandler,
    resetClickHandler
}) => {

    // Handlers
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        const dieData = active.data.current as Die
        const targetData = over ? over.data.current : undefined

        if (
            (dieData.groupKey && dieData.groupKey === targetData?.key)
            || (dieData.key === targetData?.key)
            || (dieData.groupKey && dieData.groupKey === targetData?.groupKey)
        ) return

        if (targetData instanceof DiceGroup || !targetData) {
            console.log(`owawawa:${JSON.stringify(dieData)}+${targetData}`)
            addToGroupHandler(dieData, targetData?.key)
        }
        else if (targetData instanceof Die && dieData.key !== targetData.key) {
            if (targetData.groupKey) {
                addToGroupHandler(dieData, targetData.groupKey)
            } else if (!dieData.groupKey) {
                createGroupHandler([dieData, targetData])
            } else {
                addToGroupHandler(dieData, undefined)
            }

        }
    }

    return (
        <div className="die-pool-container">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="die-pool">
                    {diceGroups.map(diceGroup => (
                        <DiceGroupDisplay
                            key={diceGroup.key}
                            diceGroup={diceGroup}
                            dieInGroupClickHandler={dieInGroupClickHandler}
                            destroyGroupHandler={destroyGroupHandler}
                        />
                    ))}
                    {dice.map(die => (
                        <DieDisplay
                            key={die.key}
                            die={die}
                            dieClickHandler={dieClickHandler}
                        />
                    ))}
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