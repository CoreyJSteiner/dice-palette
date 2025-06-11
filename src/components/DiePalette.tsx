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

    const handleDieClick = (key: string) => {
        setDice(prevDice => prevDice.map(die => {
            if (die.key === key) {
                const newDie = new Die(die.key, die.dieSides);
                newDie.roll();
                console.log(newDie.dieValue)
                return newDie;
            }
            return die;
        }));
    }

    const handleRollAll = () => {
        setDice(prevDice => prevDice.map(die => {
            const newDie = new Die(die.key, die.dieSides);
            newDie.roll();
            console.log(newDie.dieValue)
            return newDie;
            return die;
        }));
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleAddDie} />
            <DiePool dice={dice} onClearClick={handleClearDice} onDieClick={handleDieClick} />
            <button className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete