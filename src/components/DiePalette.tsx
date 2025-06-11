import { useState } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"
import Die from './Die'
import DiceGroup from './DiceGroup'

type DieArray = Array<Die>
type DiceGroups = Array<DiceGroup>

const DiePallete: React.FC = () => {
    const [dice, setDice] = useState<DieArray>([])
    const [diceGroups, setDiceGroups] = useState<DiceGroups>([
        new DiceGroup("1", [
            new Die("one", 4),
            new Die("two", 6)
        ])
    ])

    const handleClearDice = () => {
        setDice([])
        setDiceGroups([])
    }

    const handleAddDie = (dieSides: number) => {
        setDice([...dice, new Die(crypto.randomUUID(), dieSides)])
    }

    const handleDieClick = (key: string) => {
        setDice(prevDice => prevDice.map(die => {
            if (die.key === key) {
                const newDie = new Die(die.key, die.dieSides);
                newDie.roll();
                return newDie;
            }
            return die;
        }));
    }

    const handleDieInGroupClick = (groupKey: string, dieKey: string) => {
        console.log(groupKey + '||' + dieKey)
        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            if (diceGroup.key === groupKey) {
                const newDice = diceGroup.dice.map(die => {
                    if (die.key === dieKey) {
                        const newDie = new Die(die.key, die.dieSides)
                        newDie.roll()
                        return newDie
                    }

                    return die
                })

                return new DiceGroup(diceGroup.key, newDice)
            }
            return diceGroup
        }));
    }

    const handleRollAll = () => {
        setDice(prevDice => prevDice.map(die => {
            const newDie = new Die(die.key, die.dieSides);
            newDie.roll();
            return newDie;
            return die;
        }));

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            const newDice = diceGroup.dice.map(die => {
                const newDie = new Die(die.key, die.dieSides)
                newDie.roll()
                return newDie
            })

            return new DiceGroup(diceGroup.key, newDice)
        }));
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleAddDie} />
            <DiePool
                dice={dice}
                diceGroups={diceGroups}
                clearClickHandler={handleClearDice}
                dieClickHandler={handleDieClick}
                dieInGroupClickHandler={handleDieInGroupClick}
            />
            <button className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete