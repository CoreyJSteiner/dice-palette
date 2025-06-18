import { useDraggable, useDroppable } from "@dnd-kit/core"
import type { Die, PoolItem } from "./DiePalleteTypes"
import DieAndValue from "./DieAndValue"

type DieDisplayProps = {
    die: Die
    poolHoverActive: boolean
    dieClickHandler?: (key: string) => void
}

const DieDisplay: React.FC<DieDisplayProps> = ({
    die,
    poolHoverActive,
    dieClickHandler,
}) => {
    // Handlers
    const handleRightClick = (e: React.MouseEvent) => {
        if (dieClickHandler) {
            e.preventDefault()
            dieClickHandler(die.key)
        }
    }

    // Drag Ref
    const { setNodeRef: setDropRef } = useDroppable({
        id: die.key,
        data: { id: die.key, type: 'die', details: die } as PoolItem
    })

    const { attributes, listeners, transform, setNodeRef: setDragRef } = useDraggable({
        // const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({
        id: die.key,
        data: { id: die.key, type: 'die', details: die } as PoolItem
    })
    const setRefs = (node: HTMLElement | null) => {
        setDragRef(node)
        setDropRef(node)
    }

    // CSS - Transform style
    // const styleTransform = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined
    const styleTransform = transform ? { transform: `scale(0.75)` } : undefined

    return (
        <button
            ref={setRefs}
            {...listeners}
            {...attributes}
            draggable='true'
            className={`die-display${poolHoverActive ? ' pool-hover-active' : ''}`}
            onContextMenu={handleRightClick}
            style={styleTransform}
        >
            <DieAndValue die={die} />
        </button >
    )
}

export default DieDisplay