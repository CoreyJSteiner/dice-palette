import type React from "react"
import DieDisplay from "./DieDisplay"
import type Die from "./Die"

type DiePoolProps = {
    dice: Array<Die>
    onClearClick: () => void
}

const DiePool: React.FC<DiePoolProps> = ({ dice = [], onClearClick }) => {
    return (
        <div className="die-pool-container">
            <div className="die-pool">
                {dice.map(die => (
                    <DieDisplay
                        key={die.key}
                        imageName={`d${die.dieSides}`}
                        dieSides={die.dieSides}
                    />
                ))}
            </div>
            <button className="clear-button" onClick={onClearClick}>Clear</button>
        </div>
    )
}

export default DiePool