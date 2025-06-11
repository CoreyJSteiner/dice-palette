import { useDroppable } from "@dnd-kit/core"
import DiceGroup from "./DiceGroup"
import DieDisplay from "./DieDisplay"

type DiceGroupDisplayProps = {
    diceGroup: DiceGroup
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
}

const DiceGroupDisplay: React.FC<DiceGroupDisplayProps> = ({ diceGroup, dieInGroupClickHandler }) => {
    const { setNodeRef } = useDroppable({
        id: diceGroup.key
    })

    const handleDieInGroupClick = (dieKey: string) => {
        dieInGroupClickHandler(diceGroup.key, dieKey)
    }

    return (
        <div ref={setNodeRef} className="dice-group-container" >
            {
                diceGroup.dice.map(die => (
                    <DieDisplay
                        key={die.key}
                        die={die}
                        dieClickHandler={() => handleDieInGroupClick(die.key)}
                    />
                ))
            }
        </div >
    )
}

export default DiceGroupDisplay