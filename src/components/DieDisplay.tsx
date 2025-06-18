import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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


    // DnD Kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: die.key,
        data: { id: die.key, type: 'die', details: die } as PoolItem,
        animateLayoutChanges: defaultAnimateLayoutChanges
    })

    // CSS - Transform style
    const styleTransform = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            draggable='true'
            className={`die-display${poolHoverActive ? ' pool-hover-active' : ''}`}
            onContextMenu={handleRightClick}
            style={styleTransform}
        >
            <DieAndValue die={die} />
        </button>
    )
}

export default DieDisplay