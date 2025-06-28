import type React from "react"
import DieButton from "./DieButton"
import { useState, useEffect, useRef } from "react"

type DieOptionsProps = {
    onAddDie: (dieSides: number, groupKey?: string | null) => void
}

const DieOptions: React.FC<DieOptionsProps> = ({ onAddDie }) => {
    const [isHovering, setIsHovering] = useState(false)
    const [addGroup, setAddGroup] = useState<string | null>('')
    const containerRef = useRef<HTMLDivElement>(null)

    // Effects
    useEffect(() => {
        if (isHovering && containerRef.current) {
            containerRef.current.focus()
        }
    }, [isHovering])


    // Handlers
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.repeat) return
        if (e.code === 'Space') {
            e.preventDefault()
            setAddGroup(prev => prev || crypto.randomUUID())
        }
    }

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault()
            setAddGroup(null)
        }
    }

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="die-options"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        >
            <DieButton imageName="d4" dieSides={4} onAddDie={onAddDie} addGroup={addGroup} fillColor="red" />
            <DieButton imageName="d6" dieSides={6} onAddDie={onAddDie} addGroup={addGroup} fillColor="orange" />
            <DieButton imageName="d8" dieSides={8} onAddDie={onAddDie} addGroup={addGroup} fillColor="yellow" />
            <DieButton imageName="d10" dieSides={10} onAddDie={onAddDie} addGroup={addGroup} fillColor="rgb(10, 180, 10)" />
            <DieButton imageName="d12" dieSides={12} onAddDie={onAddDie} addGroup={addGroup} fillColor="rgb(103, 182, 255)" />
            <DieButton imageName="d20" dieSides={20} onAddDie={onAddDie} addGroup={addGroup} fillColor="rgb(238, 83, 238)" />
        </div>
    )
}

export default DieOptions