import { useState, useRef, useEffect } from 'react';
import { useDroppable } from "@dnd-kit/core"
import DiceGroup from "./DiceGroup"
import DieDisplay from "./DieDisplay"

type DiceGroupDisplayProps = {
    diceGroup: DiceGroup
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
}

const DiceGroupDisplay: React.FC<DiceGroupDisplayProps> = ({ diceGroup, dieInGroupClickHandler }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setNodeRef } = useDroppable({
        id: diceGroup.key,
        data: diceGroup
    })

    // Reset hovering state when collapsing
    useEffect(() => {
        if (!isExpanded) {
            setIsHovering(false);
        }
    }, [isExpanded]);

    // Handle click on die in group
    const handleDieInGroupClick = (dieKey: string) => {
        dieInGroupClickHandler(diceGroup.key, dieKey)
    }

    // Handle container click (expand)
    const handleContainerClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    }

    // Handle minimize button click
    const handleMinimizeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
    }

    // Combined ref for DnD and container reference
    const combinedRef = (node: HTMLDivElement | null) => {
        setNodeRef(node);
        containerRef.current = node;
    }

    return (
        <div
            ref={combinedRef}
            className={`dice-group-container ${isExpanded ? 'expanded' : ''}`}
            onClick={handleContainerClick}
            onMouseEnter={() => !isExpanded && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
                transition: 'all 0.3s ease',
                transform: isHovering && !isExpanded ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isHovering && !isExpanded ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none'
            }}
        >
            {isExpanded && (
                <div>
                    <h1
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: '0.5rem',
                            left: '0.5rem',
                            margin: '0',
                            padding: '0',
                            zIndex: 10,
                            fontSize: '1.2rem',
                            color: 'white'
                        }}
                    >
                        {diceGroup.sum()}
                    </h1>
                    <button
                        className="minimize-button"
                        onClick={handleMinimizeClick}
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: '0.2rem',
                            right: '0.5rem',
                            border: 'none',
                            borderRadius: '0',
                            background: 'none',
                            width: '1.5rem',
                            height: '1.5rem',
                            padding: 0,
                            zIndex: 10,
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{ fontSize: '1.2rem', color: 'white' }}>−</span>
                    </button>
                </div>
            )}

            {!isExpanded && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'grey',
                    width: '100%',
                    height: '100%'
                }}>
                    <h1 style={{ color: 'white', padding: '0', margin: '0' }}>{diceGroup.sum()}</h1>
                </div>
            )}

            <div className="dice-content" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: isExpanded ? '1.5rem' : '0',
                transition: 'all 0.3s ease',
            }}>
                {diceGroup.dice.map(die => (
                    <div style={{
                        transform: isExpanded ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}>
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