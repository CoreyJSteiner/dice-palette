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
    const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set())

    // Effects
    useEffect(() => {
        const handleKeyboardDownEvent = (e: KeyboardEvent) => {
            if (!e.repeat) {
                setHeldKeys(prevHeldKeys => new Set([...prevHeldKeys, e.code]))
            }
        }

        const handleKeyboardUpEvent = (e: KeyboardEvent) => {
            setHeldKeys(prevHeldKeys => {
                const newSet = new Set(prevHeldKeys)
                newSet.delete(e.code)
                return newSet
            });
        }

        window.addEventListener('keydown', handleKeyboardDownEvent)
        window.addEventListener('keyup', handleKeyboardUpEvent)

        return () => {
            window.removeEventListener('keydown', handleKeyboardDownEvent)
            window.removeEventListener('keyup', handleKeyboardUpEvent)
        }
    }, [])

    useEffect(() => {
        if (heldKeys.has('Space')) return
        if (diceGroups.filter(diceGroup => diceGroup.dice.length === 1).length > 0) {
            setDice(prevDice => [
                ...prevDice,
                ...diceGroups.filter(diceGroup => diceGroup.dice.length === 1).map(diceGroup => {
                    const { key, dieSides, dieValue } = diceGroup.dice[0]
                    return new Die(key, dieSides, dieValue, null)
                })
            ])
            setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.dice.length > 1))
        }
    }, [diceGroups, heldKeys])

    // Callbacks
    const rollDie = useCallback((die: Die): Die => {
        const newDie = new Die(die.key, die.dieSides, undefined, die.groupKey)
        newDie.roll()
        return newDie
    }, [])

    const rollDieById = useCallback((die: Die, dieKey: string): Die => {
        if (die.key === dieKey) {
            return rollDie(die)
        }

        return die
    }, [rollDie])

    // Handlers
    const handleNewDie = (dieSides: number, groupKey: string | null | undefined) => {
        if (groupKey) {
            console.log(groupKey)
            const newDie = new Die(crypto.randomUUID(), dieSides, undefined, groupKey)
            const existingDiceGroup = diceGroups.find(diceGroup => diceGroup.key === groupKey)
            const existingDice = existingDiceGroup ? existingDiceGroup.dice : []
            setDiceGroups(prevDiceGroups => [
                ...prevDiceGroups.filter(diceGroup => diceGroup.key !== groupKey),
                new DiceGroup(groupKey, [...existingDice, newDie])
            ])
        } else {
            setDice([...dice, new Die(crypto.randomUUID(), dieSides)])
        }
    }

    const handleClearDice = () => {
        setDice([])
        setDiceGroups([])
    }

    const handleResetDice = () => {
        const removeDieValue = (die: Die) => new Die(die.key, die.dieSides, undefined, die.groupKey)

        setDice(prevDice => prevDice.map(die => removeDieValue(die)))
        setDiceGroups(prevDiceGroup => prevDiceGroup.map(diceGroup => {
            return new DiceGroup(diceGroup.key, diceGroup.dice.map(die => removeDieValue(die)))
        }))

    }

    const handleDieClick = (dieKey: string) => {
        setDice(prevDice => prevDice.map(die => {
            return rollDieById(die, dieKey)
        }))
    }

    const handleDestroyGroup = (groupKey: string) => {
        const dice: Array<Die> = diceGroups.filter(diceGroup => diceGroup.key === groupKey)[0].dice
        setDice(prevDice => [
            ...prevDice,
            ...dice.map(die => {
                return new Die(die.key, die.dieSides, die.dieValue, undefined)
            })
        ])
        setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.key !== groupKey))
    }

    const handleRollDiceGroup = (groupKey: string) => {
        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            if (diceGroup.key === groupKey) {
                return new DiceGroup(diceGroup.key, diceGroup.dice.map(die => rollDie(die)))
            }

            return diceGroup
        }))
    }

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
                new Die(dieData.key, dieData.dieSides, dieData.dieValue, null)
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
                    return rollDieById(die, dieKey)
                })

                return new DiceGroup(diceGroup.key, newDice)
            }
            return diceGroup
        }

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            return diceGroupReplace(diceGroup)
        }))
    }

    const handleRollAll = () => {
        setDice(prevDice => prevDice.map(die => {
            const newDie = new Die(die.key, die.dieSides, undefined, die.groupKey)
            newDie.roll()
            return newDie
        }))

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            const newDice = diceGroup.dice.map(die => {
                const newDie = new Die(die.key, die.dieSides, undefined, die.groupKey)
                newDie.roll()
                return newDie
            })

            return new DiceGroup(diceGroup.key, newDice)
        }))
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleNewDie} />
            <DiePool
                dice={dice}
                diceGroups={diceGroups}
                clearClickHandler={handleClearDice}
                resetClickHandler={handleResetDice}
                dieClickHandler={handleDieClick}
                dieInGroupClickHandler={handleDieInGroupClick}
                addToGroupHandler={handleAddDieToGroup}
                createGroupHandler={handleCreateGroup}
                destroyGroupHandler={handleDestroyGroup}
                rollDiceGroupHandler={handleRollDiceGroup}
            />
            <button className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete