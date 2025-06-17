import { useDraggable, useDroppable } from "@dnd-kit/core"
import type { Die, PoolItem } from "./DiePalleteTypes"
import DieImage from "./DieImage"
import type { CSSProperties } from "react"

type DieDisplayProps = {
    die: Die
    dieClickHandler?: (key: string) => void
    fillColor?: string
    valueFontColor?: string
}

const DieDisplay: React.FC<DieDisplayProps> = ({
    die,
    dieClickHandler,
    fillColor = 'magenta',
    valueFontColor = 'yellow'
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
        id: die.key,
        data: die as Die
    })
    const setRefs = (node: HTMLElement | null) => {
        setDragRef(node)
        setDropRef(node)
    }

    // CSS - Transform styles
    const styleTransform = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined


    // CSS - Vars
    const styleValueFont: CSSProperties = {
        '--value-font-color': valueFontColor,
        '--value-font-border-color': fillColor,
    } as CSSProperties


    return (
        <button
            ref={setRefs}
            {...listeners}
            {...attributes}
            draggable='true'
            className='die-display'
            onContextMenu={handleRightClick}
            style={styleTransform}
        >
            <DieImage imageName={`d${die.dieSides}`} fillColor={fillColor} />
            <h1 className="die-display-value" style={styleValueFont}>{die.dieValue}</h1>
        </button >
    )
}

export default DieDisplay