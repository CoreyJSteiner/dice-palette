import React, { useState, useRef, useEffect } from 'react'
import { useDroppable } from "@dnd-kit/core"
import type { DiceGroup } from "./DiceGroup"
import DieDisplay from "./DieDisplay"

type DiceGroupDisplayProps = {
    diceGroup: DiceGroup
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    destroyGroupHandler: (groupKey: string) => void
    rollDiceGroupHandler: (groupKey: string) => void
}

const DiceGroupDisplay: React.FC<DiceGroupDisplayProps> = ({
    diceGroup,
    dieInGroupClickHandler,
    destroyGroupHandler,
    rollDiceGroupHandler
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [displayState, setDisplayState] = useState('+')
    const containerRef = useRef<HTMLDivElement>(null)

    // Effects
    useEffect(() => {
        if (isHovering && containerRef.current && !isExpanded) {
            containerRef.current.focus()
        }
    }, [isHovering, isExpanded])

    useEffect(() => {
        if (!isExpanded) {
            setIsHovering(false)
            containerRef.current?.focus()
        }
    }, [isExpanded])

    // Handlers
    const displayNum = () => {
        const diceValues = diceGroup.dice.map(die => die.dieValue ? die.dieValue : 0)

        switch (displayState) {
            case '+':
                return diceValues.reduce((sum, dieValue) => sum + dieValue)
                break;
            case 'kh':
                return Math.max(...diceValues)
                break;
            case 'kl':
                return Math.min(...diceValues)
                break;
            default:
                return diceValues.reduce((sum, dieValue) => sum + dieValue)
                break;
        }
    }

    const handleDieInGroupClick = (dieKey: string) => {
        dieInGroupClickHandler(diceGroup.key, dieKey)
    }

    const handleContainerClick = () => {
        if (!isExpanded) {
            setIsExpanded(true)
            setIsHovering(false)
        }
    }

    const handleMinimizeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(false)
    }

    const handleRightClickOnCollapse = (e: React.MouseEvent) => {
        e.preventDefault()
        rollDiceGroupHandler(diceGroup.key)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.repeat) return
        const handleSpaceDown = () => {
            e.preventDefault()
            setDisplayState(prev => {
                switch (prev) {
                    case '+': return 'kh'
                    case 'kh': return 'kl'
                    case 'kl': return '+'
                    default: return '+'
                }
            })
        }

        const handleDelete = () => {
            e.preventDefault()
            destroyGroupHandler(diceGroup.key)
        }

        if (e.code === 'Space') handleSpaceDown()
        if (e.code === 'Backspace' || e.code === 'Delete') handleDelete()
    }

    // Drag Ref
    const { setNodeRef } = useDroppable({
        id: diceGroup.key,
        data: diceGroup
    })

    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node)
        containerRef.current = node
    }

    // CSS - Transform Styles
    const styleDieDisplayTransform = {
        transform: isExpanded ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s ease',
    }

    const styleDieGroupTransform = {
        transition: 'all 0.3s ease',
        transform: isHovering && !isExpanded ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovering && !isExpanded ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none'
    }

    const styleDiceContentTransform = {
        padding: isExpanded ? '1.5rem' : '0',
        transition: 'all 0.3s ease',
    }

    return (
        <div
            ref={combinedRef}
            tabIndex={0}
            className={`dice-group-container ${isExpanded ? 'expanded' : ''}`}
            onClick={handleContainerClick}
            onMouseEnter={() => !isExpanded && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onKeyDown={handleKeyDown}
            style={styleDieGroupTransform}
        >
            {isExpanded && (
                <div>
                    <h1 className='dice-group-expand-display'>{displayNum()}</h1>
                    <button
                        className="minimize-button"
                        onClick={handleMinimizeClick}
                    >
                        <span className='material-symbols-outlined dice-group-close'>close</span>
                    </button>
                </div>
            )}

            {!isExpanded && (
                <div
                    className="dice-group-collapse-cover"
                    onContextMenu={handleRightClickOnCollapse}
                >
                    <h1 className='dice-group-collapse-display'>{displayNum()}</h1>
                    <p className='dice-group-collapse-display-state'>{displayState}</p>
                </div>
            )
            }

            <div className="dice-content" style={styleDiceContentTransform}>
                {diceGroup.dice.map(die => (
                    <div key={die.key} style={styleDieDisplayTransform} >
                        <DieDisplay
                            key={die.key}
                            die={die}
                            dieClickHandler={() => handleDieInGroupClick(die.key)}

                        />
                    </div>
                ))}
            </div>
        </div >
    )
}

export default DiceGroupDisplay