import type React from "react"
import DieButton from "./DieButton"
import { useState, useEffect } from "react"

type DieOptionsProps = {
    onAddDie: (dieSides: number, groupKey: string | null | undefined) => void
}

const DieOptions: React.FC<DieOptionsProps> = ({ onAddDie }) => {
    const [addGroup, setAddGroup] = useState<string | null | undefined>(null)

    // Effects
    useEffect(() => {
        const handleKeyboardDownEvent = (e: KeyboardEvent) => {
            const handleGroupAdd = () => {
                if (addGroup) return
                setAddGroup(crypto.randomUUID())
            }

            e.preventDefault()
            if (e.code === 'Space') handleGroupAdd()
        }

        const handleKeyboardUpEvent = (e: KeyboardEvent) => {
            const handleClearAddGroup = () => {
                setAddGroup(null)
            }

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
    }, [addGroup])

    return (
        <div
            className="die-options"
        >
            <DieButton imageName="d4" dieSides={4} onAddDie={onAddDie} addGroup={addGroup} />
            <DieButton imageName="d6" dieSides={6} onAddDie={onAddDie} addGroup={addGroup} />
            <DieButton imageName="d8" dieSides={8} onAddDie={onAddDie} addGroup={addGroup} />
            <DieButton imageName="d10" dieSides={10} onAddDie={onAddDie} addGroup={addGroup} />
            <DieButton imageName="d12" dieSides={12} onAddDie={onAddDie} addGroup={addGroup} />
            <DieButton imageName="d20" dieSides={20} onAddDie={onAddDie} addGroup={addGroup} />
        </div>
    )
}

export default DieOptions