import { useCallback, useEffect, useState, useRef } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"
import type { Die, DiceGroup, PoolItem } from './DiePalleteTypes'

const DiePallete: React.FC = () => {
    const [dice, setDice] = useState<Die[]>([])
    const [diceGroups, setDiceGroups] = useState<DiceGroup[]>([])
    const [pool, setPool] = useState<PoolItem[]>([])
    const heldKeysRef = useRef<Set<string>>(new Set())
    const rollAllButtonRef = useRef<HTMLButtonElement>(null)

    // Effects
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!e.repeat) {
                heldKeysRef.current.add(e.code)
                console.log(e.code)
                if (e.code === 'Tab') {
                    e.preventDefault()
                    rollAllButtonRef.current?.click()
                }
            }
        }

        const handleKeyUp = (e: KeyboardEvent): void => {
            heldKeysRef.current.delete(e.code);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return (): void => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    useEffect(() => {
        if (heldKeysRef.current.has('Space')) return
        if (diceGroups.filter(diceGroup => diceGroup.dice.length === 1).length > 0) {
            setDice((prevDice) => [
                ...prevDice,
                ...diceGroups.filter(diceGroup => diceGroup.dice.length === 1).map(diceGroup => {
                    return { ...diceGroup.dice[0], groupKey: null }
                })
            ])
            setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.dice.length > 1))
        }
    }, [diceGroups])

    // Callbacks
    const rollDie = useCallback((die: Die): Die => {
        return { ...die, dieValue: Math.floor(Math.random() * die.dieSides + 1) }
    }, [])

    const rollDieById = useCallback((die: Die, dieKey: string): Die => {
        if (die.key === dieKey) {
            return rollDie(die)
        }

        return die
    }, [rollDie])

    // Handlers
    const handleNewDie = (dieSides: number, groupKey: string | null | undefined): void => {
        if (groupKey) {
            const newDie = {
                key: crypto.randomUUID(),
                dieSides: dieSides,
                groupKey: groupKey
            }
            const existingDiceGroup = diceGroups.find(diceGroup => diceGroup.key === groupKey)
            const existingDice = existingDiceGroup ? existingDiceGroup.dice : []
            setDiceGroups((prevDiceGroups: DiceGroup[]): DiceGroup[] => [
                ...prevDiceGroups.filter(diceGroup => diceGroup.key !== groupKey),
                { key: groupKey, dice: [...existingDice, newDie] }
            ])
        } else {
            setDice([...dice, { key: crypto.randomUUID(), dieSides }])
        }
    }

    const handleClearDice = (): void => {
        setDice([])
        setDiceGroups([])
    }

    const handleResetDice = (): void => {
        const removeDieValue = (die: Die): Die => {
            return { ...die, dieValue: null }
        }

        setDice(prevDice => prevDice.map(die => removeDieValue(die)))
        setDiceGroups(prevDiceGroup => prevDiceGroup.map(diceGroup => {
            return { key: diceGroup.key, dice: diceGroup.dice.map(die => removeDieValue(die)) }
        }))
    }

    const handleDieClick = (dieKey: string): void => {
        setDice(prevDice => prevDice.map(die => {
            return rollDieById(die, dieKey)
        }))
    }

    const handleDestroyGroup = (groupKey: string): void => {
        const dice: Array<Die> = diceGroups.filter(diceGroup => diceGroup.key === groupKey)[0].dice
        setDice(prevDice => [
            ...prevDice,
            ...dice.map(die => {
                return { ...die, groupKey: null }
            })
        ])
        setDiceGroups(prevDiceGroups => prevDiceGroups.filter(diceGroup => diceGroup.key !== groupKey))
    }

    const handleRollDiceGroup = (groupKey: string): void => {
        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            if (diceGroup.key === groupKey) {
                return { ...diceGroup, dice: diceGroup.dice.map(die => rollDie(die)) }
            }

            return diceGroup
        }))
    }

    const handleAddDieToGroup = (dieData: Die, targetGroupKey?: string | null): void => {
        if (targetGroupKey) {
            setDice(prevDice => prevDice.filter(die => die.key !== dieData.key))
            setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
                if (diceGroup.key === targetGroupKey) {
                    const newGroup: DiceGroup = {
                        key: diceGroup.key,
                        dice: [
                            ...diceGroup.dice,
                            { ...dieData, groupKey: diceGroup.key }
                        ]
                    }
                    return newGroup
                }

                if (diceGroup.key === dieData.groupKey) {
                    const oldGroup = {
                        key: diceGroup.key,
                        dice: diceGroup.dice.filter(die => die.key !== dieData.key)
                    }
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

                const newGroup = { key: diceGroup.key, dice: newDice }
                return newGroup
            }).filter(group => group.dice.length > 0))
            setDice(prevDice => [
                ...prevDice,
                { ...dieData, groupKey: null }
            ])
        }
    }

    const handleCreateGroup = (dice: Array<Die>): void => {
        const diceKeys = dice.map(die => die.key)
        const diceOldGroups = dice.map(die => die.groupKey)
        const newGroupKey = crypto.randomUUID()
        setDice(prevDice => prevDice.filter(die => {
            return !diceKeys.includes(die.key)
        }))
        setDiceGroups(prevDiceGroups => [
            ...prevDiceGroups.map(prevDiceGroup => {
                if (diceOldGroups.includes(prevDiceGroup.key)) {
                    return {
                        key: prevDiceGroup.key,
                        dice: prevDiceGroup.dice.filter(die => !diceKeys.includes(die.key))
                    }
                }

                return prevDiceGroup
            }),
            {
                key: newGroupKey,
                dice: dice.map(die => {
                    return { ...die, groupKey: newGroupKey }
                })
            }
        ].filter(group => group.dice.length > 0))
    }

    const handleDieInGroupClick = (groupKey: string, dieKey: string): void => {
        const diceGroupReplace = (diceGroup: DiceGroup): DiceGroup => {
            if (diceGroup.key === groupKey) {
                const newDice = diceGroup.dice.map(die => {
                    return rollDieById(die, dieKey)
                })

                return { key: diceGroup.key, dice: newDice }
            }
            return diceGroup
        }

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            return diceGroupReplace(diceGroup)
        }))
    }

    const handleRollAll = (): void => {
        setDice(prevDice => prevDice.map(die => {
            return rollDie(die)
        }))

        setDiceGroups(prevDiceGroups => prevDiceGroups.map(diceGroup => {
            const newDice = diceGroup.dice.map(die => {
                return rollDie(die)
            })

            return { key: diceGroup.key, dice: newDice }
        }))
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleNewDie} />
            <DiePool
                dice={dice}
                diceGroups={diceGroups}
                pool={pool}
                clearClickHandler={handleClearDice}
                resetClickHandler={handleResetDice}
                dieClickHandler={handleDieClick}
                dieInGroupClickHandler={handleDieInGroupClick}
                addToGroupHandler={handleAddDieToGroup}
                createGroupHandler={handleCreateGroup}
                destroyGroupHandler={handleDestroyGroup}
                rollDiceGroupHandler={handleRollDiceGroup}
            />
            <button ref={rollAllButtonRef} className='die-pallete-roll-all' onClick={handleRollAll}>Roll All</button>
        </div>
    )
}

export default DiePallete