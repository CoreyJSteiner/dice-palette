import { useCallback, useEffect, useState } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"
import Die from './Die'
import DiceGroup from './DiceGroup'

type DieArray = Array<Die>
type DiceGroups = Array<DiceGroup>

const DiePallete: React.FC = () => {
    const [dice, setDice] = useState<DieArray>([])
    const [diceGroups, setDiceGroups] = useState<DiceGroups>([])

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

    useEffect(() => {
        if (diceGroups.filter(diceGroup => diceGroup.dice.length === 1).length > 0) {
            setDice(prevDice => [
                ...prevDice,
                ...diceGroups.filter(diceGroup => diceGroup.dice.length === 1).map(diceGroup => diceGroup.dice[0])
            ])
            setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.dice.length > 1))
        }
    }, [diceGroups])

    // const removeGroup = (groupKey: string) => {
    //     setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.key !== groupKey))
    // }

    const handleAddDieToGroup = (dieData: Die, targetGroupKey: string | undefined) => {
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

                if (diceGroup.key === dieData.groupKey) {
                    const oldGroup = new DiceGroup(
                        diceGroup.key,
                        diceGroup.dice.filter(die => die.key !== dieData.key)
                    )
                    return oldGroup
                }

                return diceGroup
            }).filter(group => group.dice.length > 0))
        } else if (dieData.groupKey) {
            setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
                const newDice: Array<Die> = []
                diceGroup.dice.forEach(die => {
                    if (die.key !== dieData.key) newDice.push(die)
                })

                const newGroup = new DiceGroup(diceGroup.key, newDice)
                return newGroup
            }).filter(group => group.dice.length > 0))
            setDice(prevDice => [
                ...prevDice,
                new Die(dieData.key, dieData.dieSides, dieData.dieValue, undefined)
            ])
        }
    }

    const handleCreateGroup = (dice: Array<Die>) => {
        const diceKeys = dice.map(die => die.key)
        const diceOldGroups = dice.map(die => die.groupKey)
        const newGroupKey = crypto.randomUUID()
        setDice(prevDice => prevDice.filter(die => {
            return !diceKeys.includes(die.key)
        }))
        setDiceGroups(prevDiceGroups => [
            ...prevDiceGroups.map(prevDiceGroup => {
                if (diceOldGroups.includes(prevDiceGroup.key)) {
                    return new DiceGroup(
                        prevDiceGroup.key,
                        prevDiceGroup.dice.filter(die => !diceKeys.includes(die.key))
                    )
                }

                return prevDiceGroup
            }),
            new DiceGroup(newGroupKey, dice.map(die => {
                const newDie = new Die(die.key, die.dieSides, die.dieValue, newGroupKey)
                return newDie
            }))
        ].filter(group => group.dice.length > 0))
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
                createGroupHandler={handleCreateGroup}
            />
            <button className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete