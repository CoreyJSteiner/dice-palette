import { useState } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"
import Die from './Die'

const DiePallete = () => {
    const [dice, setDice] = useState(Array<Die>)

    const handleClearDice = () => {
        setDice([])
    }

    const handleAddDie = (dieSides: number) => {
        setDice([...dice, new Die(crypto.randomUUID(), dieSides)])
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleAddDie} />
            <DiePool dice={dice} onClearClick={handleClearDice} />
        </div>
    )
}

export default DiePallete