import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSortable } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
import type { PoolItem, DiceGroup } from "./DiePalleteTypes"
import DieDisplay from "./DieDisplay"

type DiceGroupDisplayProps = {
    diceGroup: DiceGroup
    poolDragState: boolean
    poolHoverActive: boolean
    poolHoverCenter?: boolean
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    destroyDieHandler: (dieKey: string) => void
    destroyGroupHandler: (groupKey: string) => void
    rollDiceGroupHandler: (groupKey: string) => void
}

const DiceGroupDisplay: React.FC<DiceGroupDisplayProps> = ({
    diceGroup,
    poolDragState,
    poolHoverActive,
    poolHoverCenter,
    dieInGroupClickHandler,
    destroyDieHandler,
    destroyGroupHandler,
    rollDiceGroupHandler
}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [displayState, setDisplayState] = useState('+')
    const containerRef = useRef<HTMLDivElement>(null)
    const collapseDisplayRef = useRef<HTMLHeadingElement>(null)

    // Effects
    useEffect(() => { }, [poolDragState])

    useEffect(() => {
        if (isHovering && containerRef.current && !isExpanded) {
            containerRef.current.focus()
        }
    }, [isHovering, isExpanded])

    useEffect(() => {
        // if (!isExpanded) {
        setIsHovering(false)
        containerRef.current?.focus()
        // }
    }, [isExpanded])

    // Generic
    const displayNum = useCallback(() => {
        const diceValues = diceGroup.dice.map(die => die.dieValue ?? 0)
        switch (displayState) {
            case 'kh': return Math.max(...diceValues)
            case 'kl': return Math.min(...diceValues)
            default: return diceValues.reduce((sum, val) => sum + val, 0)
        }
    }, [displayState, diceGroup.dice])

    useEffect(() => {
        console.log(collapseDisplayRef)
        // collapseDisplayRef.style
        // this is inteded to updat eteh font size in a future updata so that the displayed result always fits
        // the container

    }, [displayNum])

    // Handlers
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
        const cycleDisplayState = () => {
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

        const destroyGroupSelf = () => {
            e.preventDefault()
            destroyGroupHandler(diceGroup.key)
        }

        if ((e.code === 'Backspace' || e.code === 'Delete') && !isExpanded) destroyGroupSelf()
        if (e.code === 'Space') cycleDisplayState()
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging
    } = useSortable({
        id: diceGroup.key,
        data: {
            type: 'group',
            details: diceGroup
        } as PoolItem,
    })

    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node)
        containerRef.current = node
    }

    // CSS - Transform Styles
    const containerStyle = {
        opacity: isDragging ? 0 : 1,
    }

    const styleDieGroupTransform = {
        transform: isExpanded ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s ease'
    }

    const styleDiceContentTransform = {
        padding: isExpanded ? '' : '0', transition: 'all 0.3s ease'
    }

    return (
        <div
            ref={combinedRef}
            tabIndex={0}
            className={
                `dice-group-container ${isExpanded ? 'expanded' : ''} ${poolHoverActive && !isExpanded ? ' pool-hover-active' : ''}${poolHoverCenter ? (isExpanded ? ' pool-hover-center-light' : ' pool-hover-center') : ''}`
            }
            onClick={handleContainerClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onKeyDown={handleKeyDown}
            style={containerStyle}
        >
            {isExpanded && (
                <div>
                    <h1 className='dice-group-expand-display'>{displayNum()}</h1>
                    <button className="minimize-button" onClick={handleMinimizeClick}>
                        <span className='material-symbols-outlined dice-group-close'>collapse_content</span>
                    </button>
                    <p className='dice-group-collapse-display-state'>{displayState}</p>
                </div>
            )}

            {!isExpanded && (
                <div className="dice-group-collapse-cover" onContextMenu={handleRightClickOnCollapse}>
                    <h1
                        ref={collapseDisplayRef}
                        className='dice-group-collapse-display'
                    >
                        {displayNum()}
                    </h1>

                    <span
                        {...listeners}
                        {...attributes}
                        className='material-symbols-outlined dice-group-collapse-drag-handle'>drag_indicator</span>

                    <p className='dice-group-collapse-display-state'>{displayState}</p>
                </div>
            )}

            <div className={`dice-content ${isExpanded ? '' : 'display-none'}`} style={styleDiceContentTransform}>
                {diceGroup.dice.map(die => (
                    <div key={die.key} style={styleDieGroupTransform}>
                        <DieDisplay
                            key={die.key}
                            data-id={die.key}
                            poolHoverActive={false}
                            die={die}
                            dieClickHandler={() => handleDieInGroupClick(die.key)}
                            destroyDieHandler={destroyDieHandler}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DiceGroupDisplay
