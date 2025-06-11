import type React from "react"
import DieDisplay from "./DieDisplay"

const DiePool: React.FC = () => {
    return (
        <div className="die-pool-container">
            <div className="die-pool">
                <DieDisplay imageName="d4" dieSides={4} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
                <DieDisplay imageName="d10" dieSides={10} />
            </div>
            <button className="clear-button">Clear</button>
        </div>
    )
}

export default DiePool