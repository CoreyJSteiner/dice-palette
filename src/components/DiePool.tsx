import type React from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import Die from "./Die"
import DiceGroup from "./DiceGroup"

type DiePoolProps = {
    dice: Array<Die>
    diceGroups: Array<DiceGroup>
    dieClickHandler: (key: string) => void
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    clearClickHandler: () => void
}

const DiePool: React.FC<DiePoolProps> = ({
    dice = [],
    diceGroups = [],
    clearClickHandler,
    dieClickHandler,
    dieInGroupClickHandler
}) => {

    return (
        <div className="die-pool-container">
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
            <button className="clear-button" onClick={clearClickHandler}>Clear</button>
        </div>
    )
}

export default DiePool