import type React from "react"
import DieDisplay from "./DieDisplay"
import type Die from "./Die"

type DiePoolProps = {
    dice: Array<Die>
    onDieClick: (key: string) => void
    onClearClick: () => void
}

const DiePool: React.FC<DiePoolProps> = ({ dice = [], onClearClick, onDieClick }) => {
    return (
        <div className="die-pool-container">
            <div className="die-pool">
                {dice.map(die => (
                    <DieDisplay
                        key={die.key}
                        die={die}
                        handleClick={onDieClick}
                    />
                ))}
            </div>
            <button className="clear-button" onClick={onClearClick}>Clear</button>
        </div>
    )
}

export default DiePool