import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable"
import { useState, useEffect, useRef } from 'react'
import type { Die, PoolItem } from "./DiePalleteTypes"
import DieAndValue from "./DieAndValue"

type DieDisplayProps = {
    die: Die
    poolHoverActive: boolean
    poolHoverCenter?: boolean
    dieClickHandler: (key: string) => void
    destroyDieHandler: (key: string) => void
}

const DieDisplay: React.FC<DieDisplayProps> = ({
    die,
    poolHoverActive,
    poolHoverCenter,
    dieClickHandler,
    destroyDieHandler,
}) => {
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Effects
    useEffect(() => {
        if (isHovering && buttonRef.current) {
            buttonRef.current.focus()
        }
    }, [isHovering])

    // Handlers
    const handleRightClick = (e: React.MouseEvent) => {
        if (dieClickHandler) {
            e.preventDefault()
            dieClickHandler(die.key)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.repeat) return

        const destroyDieSelf = () => {
            e.preventDefault()
            destroyDieHandler(die.key)
        }

        if (e.code === 'Backspace' || e.code === 'Delete') destroyDieSelf()
    }

    // DnD Kit
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging
    } = useSortable({
        id: die.key,
        data: { id: die.key, type: 'die', details: die } as PoolItem,
        animateLayoutChanges: defaultAnimateLayoutChanges
    })

    const combinedRef = (node: HTMLButtonElement | null) => {
        setNodeRef(node)
        buttonRef.current = node
    }

    // CSS - Transform style
    const styleTransform = {
        opacity: isDragging ? 0 : 1,
    }

    return (
        <button
            ref={combinedRef}
            {...listeners}
            {...attributes}
            draggable='true'
            data-id={die.key}
            className={`die-display${poolHoverActive ? ' pool-hover-active' : ''}${poolHoverCenter ? ' pool-hover-center' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onContextMenu={handleRightClick}
            onKeyDown={handleKeyDown}
            style={styleTransform}
        >
            <DieAndValue die={die} />
        </button>
    )
}

export default DieDisplay