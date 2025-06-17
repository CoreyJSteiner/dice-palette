import { useCallback, useEffect, useState, useRef } from 'react'
import './DieComponent.css'
import DieOptions from "./DieOptions"
import DiePool from "./DiePool"
import type { Die, DiceGroup, PoolItem } from './DiePalleteTypes'

const DiePallete: React.FC = () => {
    const [poolState, setPoolState] = useState<PoolItem[]>([])
    const heldKeysRef = useRef<Set<string>>(new Set())
    const rollAllButtonRef = useRef<HTMLButtonElement>(null)

    // Effects
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!e.repeat) {
                heldKeysRef.current.add(e.code)
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
        const singleGroups: PoolItem[] = poolState.filter(poolItem => (
            poolItem.type === 'group' && poolItem.details.dice.length === 1
        ))
        const removalGroups = new Set(singleGroups.map(group => group.id))

        if (singleGroups.length > 0) {
            setPoolState((prevPoolState) => {
                const updatedPoolState: PoolItem[] = prevPoolState.filter(poolItem => (
                    !removalGroups.has(poolItem.id)
                ))

                const orphPoolItems = singleGroups.reduce((orphDice: PoolItem[], orphPoolItem: PoolItem) => {
                    if (orphPoolItem.type === 'die') {
                        orphDice.push(orphPoolItem)

                        return orphDice
                    }

                    const newPoolItemsDie: PoolItem[] = orphPoolItem.details.dice.map((die: Die) => {
                        return {
                            id: die.key,
                            type: 'die',
                            details: { ...die, groupKey: null }
                        }
                    })

                    return orphDice.concat(newPoolItemsDie)
                }, [] as PoolItem[])

                return updatedPoolState.concat(orphPoolItems)
            })
        }
    }, [poolState])

    // Generic Functions
    const rollDie = useCallback((die: Die): Die => {
        return { ...die, dieValue: Math.floor(Math.random() * die.dieSides + 1) }
    }, [])

    // Pool Setters
    const poolAddDieToGroup = (inputDie: Die, groupKey: string): void => {
        setPoolState(prevPoolState => {
            if (prevPoolState.find(poolItem => poolItem.id === groupKey)) {
                const updatedPoolState = prevPoolState.map(poolItem => {
                    if (poolItem.id === groupKey && poolItem.type === 'group') {
                        const updatedPoolItem: PoolItem = structuredClone(poolItem)
                        updatedPoolItem.details.dice = [
                            ...updatedPoolItem.details.dice,
                            { ...inputDie }
                        ]

                        return updatedPoolItem
                    }

                    return poolItem
                })
                return updatedPoolState
            }

            const newPoolItemGroup: PoolItem = {
                id: groupKey,
                type: 'group',
                details: {
                    key: groupKey,
                    dice: [{ ...inputDie, groupKey: groupKey } as Die]
                }
            }

            return [...prevPoolState, newPoolItemGroup] as PoolItem[]
        })
    }

    const poolAddDieToPool = (inputDie: Die): void => {
        const newPoolItem: PoolItem = {
            id: inputDie.key,
            type: 'die',
            details: inputDie
        }

        setPoolState(prevPoolState => [...prevPoolState, newPoolItem])
    }

    // Handlers
    const handleNewDie = (dieSides: number, groupKey?: string | null): void => {
        const newDie = {
            key: crypto.randomUUID(),
            dieSides: dieSides,
            groupKey: groupKey
        }
        if (groupKey) {
            poolAddDieToGroup(newDie, groupKey)

        } else {
            poolAddDieToPool(newDie)

        }
    }

    const handleClearDice = (): void => {
        setPoolState([])
    }

    const handleResetDice = (): void => {
        const removeDieValue = (die: Die): Die => {
            return { ...die, dieValue: null }
        }

        setPoolState(prevPoolState => prevPoolState.map(poolItem => {
            const updatedItem = structuredClone(poolItem)
            if (updatedItem.type === 'group') {
                const group: DiceGroup = updatedItem.details
                updatedItem.details.dice = group.dice.map(die => removeDieValue(die))
            } else if (updatedItem.type === 'die') {
                updatedItem.details = removeDieValue(updatedItem.details)
            }
            return updatedItem
        }))
    }

    const handleDestroyGroup = (groupKey: string): void => {
        const dieToPoolItem = (die: Die): PoolItem => {
            return { id: die.key, type: 'die', details: { ...die, groupKey: null } }
        }

        setPoolState(prevPoolState => {
            let poolItemsDie: PoolItem[] = []
            return prevPoolState.filter(poolItem => {
                if (poolItem.id !== groupKey) return true
                if (poolItem.id === groupKey && poolItem.type === 'group') {
                    poolItemsDie = poolItem.details.dice.map(die => {
                        return dieToPoolItem(die)
                    })
                }
                return false
            }).concat(poolItemsDie)
        })
    }

    const handleAddDieToGroup = (dieData: Die, targetGroupKey?: string | null): void => {
        setPoolState(prevPoolState => {
            const removeFromGroup: string | null = dieData.groupKey ? dieData.groupKey : null

            const updatedPoolState = prevPoolState.map(poolItem => {
                if (poolItem.type === 'group' && removeFromGroup === poolItem.id) {
                    const updatedGroup = structuredClone(poolItem.details)
                    updatedGroup.dice = updatedGroup.dice.filter(die => die.key !== dieData.key)

                    return { ...poolItem, details: updatedGroup }
                } else if (poolItem.type === 'group' && poolItem.id === targetGroupKey) {
                    const updatedGroup = structuredClone(poolItem.details)
                    updatedGroup.dice = [...updatedGroup.dice, { ...dieData, groupKey: poolItem.id }]

                    return { ...poolItem, details: updatedGroup }
                }

                return poolItem
            }).filter(poolItem => (
                (poolItem.type === 'die' && poolItem.id !== dieData.key) ||
                (poolItem.type === 'group' && poolItem.details.dice.length > 0)
            ))

            if (!targetGroupKey) updatedPoolState.push({
                id: dieData.key,
                type: 'die',
                details: { ...dieData, groupKey: null }
            })

            return updatedPoolState
        })
    }

    const handleCreateGroup = (inputDice: Array<Die>): void => {
        setPoolState(prevPoolState => {
            type DiceRemovalMap = Record<string, Set<string>>
            const diceGroupRemovals: DiceRemovalMap = inputDice.reduce((groupMap: DiceRemovalMap, die: Die) => {
                if (die.groupKey) {
                    if (!groupMap[die.groupKey]) groupMap[die.groupKey] = new Set()
                    groupMap[die.groupKey].add(die.groupKey)
                }
                return groupMap
            }, {})
            const diceRemovals = new Set(inputDice.map(die => die.key))

            const isRemovalGroup = (groupKey: string): boolean => groupKey in diceGroupRemovals
            const isRemovalDie = (dieKey: string): boolean => diceRemovals.has(dieKey)

            const updatedPoolState = prevPoolState.map(poolItem => {
                if (poolItem.type === 'group' && isRemovalGroup(poolItem.id)) {
                    const updatedGroup = structuredClone(poolItem.details)
                    updatedGroup.dice = updatedGroup.dice.filter(die => !isRemovalDie(die.key))

                    return { ...poolItem, details: updatedGroup }
                }
                return poolItem
            }).filter(poolItem => (
                !isRemovalDie(poolItem.id) ||
                (poolItem.type === 'group' && poolItem.details.dice.length > 0)
            ))

            const newGroupId = crypto.randomUUID()

            updatedPoolState.push({
                id: newGroupId,
                type: 'group',
                details: {
                    key: newGroupId,
                    dice: inputDice.map(die => {
                        return { ...die, groupKey: newGroupId }
                    })
                }
            })

            return updatedPoolState
        })
    }

    const handleDieInGroupClick = (groupKey: string, dieKey: string): void => {

        setPoolState(prevPoolState => prevPoolState.map(poolItem => {
            if (poolItem.type === 'group' && groupKey === poolItem.id) {
                const dice = poolItem.details.dice
                const updatedPoolItem = structuredClone(poolItem)
                updatedPoolItem.details.dice = dice.map(die => {
                    if (die.key === dieKey) return rollDie(die)
                    return die
                })

                return updatedPoolItem
            }

            return poolItem
        }))
    }

    const handleDieClick = (dieKey: string): void => {
        setPoolState(prevPoolState => prevPoolState.map(poolItem => {
            if (poolItem.type === 'die' && poolItem.id === dieKey) return { ...poolItem, details: rollDie(poolItem.details) }

            return poolItem
        }))
    }


    const handleRollDiceGroup = (groupKey: string): void => {
        setPoolState(prevPoolState => {
            return prevPoolState.map(poolItem => {
                if (poolItem.type === 'group' && poolItem.id === groupKey) {
                    const dice = poolItem.details.dice
                    const updatedPoolItem = structuredClone(poolItem)
                    updatedPoolItem.details.dice = dice.map(die => rollDie(die))

                    return updatedPoolItem
                }

                return poolItem
            })
        })
    }

    const handleRollAll = (): void => {
        setPoolState(prevPoolState => prevPoolState.map(poolItem => {
            if (poolItem.type === 'die') return { ...poolItem, details: rollDie(poolItem.details) }
            if (poolItem.type === 'group') {
                const dice = poolItem.details.dice
                const updatedPoolItem = structuredClone(poolItem)
                updatedPoolItem.details.dice = dice.map(die => rollDie(die))

                return updatedPoolItem
            }

            return poolItem
        }))
    }

    return (
        <div className="die-pallete">
            <DieOptions onAddDie={handleNewDie} />
            <DiePool
                pool={poolState}
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