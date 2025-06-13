import { useState, useEffect, useRef } from "react"
import DieImage from "./DieImage"

type DieButtonProps = {
    imageName?: string
    dieSides: number
    onAddDie: (dieSides: number, groupKey: string | null | undefined) => void
}

const DieButton: React.FC<DieButtonProps> = ({ imageName = 'd20', dieSides = 20, onAddDie }) => {
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const addGroup = useRef<string | null | undefined>(null)

    // Effects
    useEffect(() => {
        const handleKeyboardDownEvent = (e: KeyboardEvent) => {
            const handleGroupAdd = () => {
                if (addGroup.current) return
                addGroup.current = crypto.randomUUID()
            }

            if (!isHovering) return
            e.preventDefault()
            if (e.code === 'Space') handleGroupAdd()
        }

        const handleKeyboardUpEvent = (e: KeyboardEvent) => {
            const handleClearAddGroup = () => {
                addGroup.current = null
            }

            if (!isHovering) return
            console.log(e.code)
            e.preventDefault()
            if (e.code === 'Space') handleClearAddGroup()
        }

        window.addEventListener('keydown', handleKeyboardDownEvent)
        window.addEventListener('keyup', handleKeyboardUpEvent)
        return () => {
            window.removeEventListener('keydown', handleKeyboardDownEvent)
            window.removeEventListener('keyup', handleKeyboardUpEvent)
        }
    }, [isHovering])

    return (
        <button
            className='die-button'
            onClick={() => onAddDie(dieSides, addGroup.current)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <DieImage imageName={imageName} />
        </button>
    )
}

export default DieButton