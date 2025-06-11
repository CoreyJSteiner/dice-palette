import { useDraggable } from "@dnd-kit/core"
import type Die from "./Die"
import DieImage from "./DieImage"

type DieDisplayProps = {
    die: Die
    dieClickHandler?: (key: string) => void
}

const DieDisplay: React.FC<DieDisplayProps> = ({ die, dieClickHandler }) => {
    const { attributes, listeners, transform, setNodeRef } = useDraggable({
        id: die.key,
        data: die
    })

    const style = transform ? { transform: `translate:${transform.x}px, ${transform.y}px` } : undefined

    const handleRightClick = (e: React.MouseEvent) => {
        if (dieClickHandler) {
            e.preventDefault()
            dieClickHandler(die.key)
        }
    }

    return (
        <button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            draggable='true'
            className='die-display'
            onContextMenu={handleRightClick}
            style={style}
        >
            <DieImage imageName={`d${die.dieSides}`} alt={die.dieSides.toString()} />
            <h1 className="die-display-value">{die.dieValue}</h1>
        </button >
    )
}

export default DieDisplay