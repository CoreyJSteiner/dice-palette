import { useCallback, useState } from 'react'
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
            new Die("one", 4, undefined, "1"),
            new Die("two", 6, undefined, "1")
        ])
    ])

    const handleClearDice = () => {
        setDice([])
        setDiceGroups([])
    }

    const handleNewDie = (dieSides: number) => {
        setDice([...dice, new Die(crypto.randomUUID(), dieSides)])
    }

    const dieRoll = useCallback((die: Die, dieKey: string): Die => {
        if (die.key === dieKey) {
            const newDie = new Die(die.key, die.dieSides)
            newDie.roll()
            return newDie
        }

        return die
    }, [])

    const handleDieClick = (dieKey: string) => {
        setDice(prevDice => prevDice.map(die => {
            return dieRoll(die, dieKey)
        }))
    }

    const handleAddDieToGroup = (dieData: Die, targetGroupKey: string | null) => {
        if (targetGroupKey) {
            setDice(prevDice => prevDice.filter(die => die.key !== dieData.key))
            setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
                if (diceGroup.key === targetGroupKey) {
                    const newGroup = new DiceGroup(
                        diceGroup.key,
                        [
                            ...diceGroup.dice,
                            new Die(
                                dieData.key,
                                dieData.dieSides,
                                dieData.dieValue,
                                diceGroup.key
                            )
                        ]
                    )
                    return newGroup
                }

                return diceGroup
            }))
        } else {
            setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
                const newDice: Array<Die> = []
                diceGroup.dice.forEach(die => {
                    if (die.key !== dieData.key) newDice.push(die)
                })

                const newGroup = new DiceGroup(diceGroup.key, newDice)
                return newGroup
            }))
            setDice([
                ...dice,
                new Die(dieData.key, dieData.dieSides, dieData.dieValue, undefined)
            ])
        }


    }

    const handleDieInGroupClick = (groupKey: string, dieKey: string) => {
        const diceGroupReplace = (diceGroup: DiceGroup): DiceGroup => {
            if (diceGroup.key === groupKey) {
                const newDice = diceGroup.dice.map(die => {
                    return dieRoll(die, dieKey)
                })

                return new DiceGroup(diceGroup.key, newDice)
            }
            return diceGroup
        }

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            return diceGroupReplace(diceGroup)
        }));
    }

    const handleRollAll = () => {
        setDice(prevDice => prevDice.map(die => {
            const newDie = new Die(die.key, die.dieSides);
            newDie.roll();
            return newDie;
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
            <DieOptions onAddDie={handleNewDie} />
            <DiePool
                dice={dice}
                diceGroups={diceGroups}
                clearClickHandler={handleClearDice}
                dieClickHandler={handleDieClick}
                dieInGroupClickHandler={handleDieInGroupClick}
                addToGroupHandler={handleAddDieToGroup}
            />
            <button className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete