import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"

const DiePallete = () => {
    return (
        <div className="die-pallete">
            <DieOptions />
            <DiePool />
        </div>
    )
}

export default DiePallete