import type React from "react"
import DieDisplay from "./DieDisplay"

type DiePoolProps = {
    dice: Array<number>
    onClearClick: () => void
}

const DiePool: React.FC<DiePoolProps> = ({ dice = [], onClearClick }) => {
    return (
        <div className="die-pool-container">
            <div className="die-pool">
                {dice.map(die => (
                    <DieDisplay
                        key={crypto.randomUUID()}
                        imageName={`d${die}`}
                        dieSides={die}
                    />
                ))}
            </div>
            <button className="clear-button" onClick={onClearClick}>Clear</button>
        </div>
    )
}

export default DiePool