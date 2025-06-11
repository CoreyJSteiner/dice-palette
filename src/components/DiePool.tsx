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
    addToGroupHandler: (dieData: Die, groupKey: string | null) => void
}

const DiePool: React.FC<DiePoolProps> = ({
    dice = [],
    diceGroups = [],
    clearClickHandler,
    dieClickHandler,
    dieInGroupClickHandler,
    addToGroupHandler
}) => {

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        const dieData = active.data.current as Die
        const targetGroup = over?.id ? over.id as string : null

        addToGroupHandler(dieData, targetGroup)
    }

    return (
        <div className="die-pool-container">
            <DndContext onDragEnd={handleDragEnd}>
                <div className="die-pool">
                    {dice.map(die => (
                        <DieDisplay
                            key={die.key}
                            die={die}
                            dieClickHandler={dieClickHandler}
                        />
                    ))}
                    {diceGroups.map(diceGroup => (
                        <DiceGroupDisplay
                            key={'1'}
                            diceGroup={diceGroup}
                            dieInGroupClickHandler={dieInGroupClickHandler}
                        />
                    ))}
                </div>
            </DndContext>
            <button className="clear-button" onClick={clearClickHandler}>Clear</button>
        </div>
    )
}

export default DiePool