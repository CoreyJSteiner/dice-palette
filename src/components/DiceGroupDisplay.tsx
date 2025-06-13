import { useState, useRef, useEffect } from 'react'
import { useDroppable } from "@dnd-kit/core"
import DiceGroup from "./DiceGroup"
import DieDisplay from "./DieDisplay"

type DiceGroupDisplayProps = {
    diceGroup: DiceGroup
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    destroyGroupHandler: (groupKey: string) => void
}

const DiceGroupDisplay: React.FC<DiceGroupDisplayProps> = ({ diceGroup, dieInGroupClickHandler, destroyGroupHandler }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Effects
    useEffect(() => {
        if (!isExpanded) {
            setIsHovering(false)
        }
    }, [isExpanded])

    // Handlers
    const handleDieInGroupClick = (dieKey: string) => {
        dieInGroupClickHandler(diceGroup.key, dieKey)
    }

    const handleContainerClick = () => {
        if (!isExpanded) {
            setIsExpanded(true)
        }
    }

    const handleMinimizeClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(false)
    }

    const handleRightClickOnCollapse = (e: React.MouseEvent) => {
        e.preventDefault()
        destroyGroupHandler(diceGroup.key)
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
            className={`dice-group-container ${isExpanded ? 'expanded' : ''}`}
            onClick={handleContainerClick}
            onMouseEnter={() => !isExpanded && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={styleDieGroupTransform}
        >
            {isExpanded && (
                <div>
                    <h1 className='dice-group-expand-sum'>{diceGroup.sum()}</h1>
                    <button
                        className="minimize-button"
                        onClick={handleMinimizeClick}
                    >
                        <span style={{ fontSize: '1.2rem', color: 'white' }}>−</span>
                    </button>
                </div>
            )}

            {!isExpanded && (
                <div className="dice-group-collapse-cover" onContextMenu={handleRightClickOnCollapse}>
                    <h1 className='dice-group-collapse-sum'>{diceGroup.sum()}</h1>
                </div>
            )}

            <div className="dice-content" style={styleDiceContentTransform}>
                {diceGroup.dice.map(die => (
                    <div style={styleDieDisplayTransform}>
                        <DieDisplay
                            key={die.key}
                            die={die}
                            dieClickHandler={() => handleDieInGroupClick(die.key)}

                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DiceGroupDisplay