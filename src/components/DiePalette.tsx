import { useState } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"

const DiePallete = () => {
    const [dice, setDice] = useState(Array<number>)

    const handleClearDice = () => {
        setDice([])
    }

    const handleAddDie = (die: number) => {
        setDice([...dice, die])
        console.log(dice)
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleAddDie} />
            <DiePool dice={dice} onClearClick={handleClearDice} />
        </div>
    )
}

export default DiePallete