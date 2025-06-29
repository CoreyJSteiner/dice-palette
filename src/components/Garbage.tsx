import type React from "react"
import { useDroppable, } from "@dnd-kit/core"

const Garbage: React.FC = () => {
    // DnD Kit
    const { setNodeRef: setGarbageRef } = useDroppable({
        id: 'garbage',
        data: {
            type: 'garbage'
        }
    })

    return (
        <div ref={setGarbageRef} className="material-symbols-outlined garbage">delete</div>
    )
}

export default Garbage