import type React from "react"
import DieButton from "./DieButton"

type DieOptionsProps = {
    onAddDie: (dieSides: number, groupKey: string | null | undefined) => void
}

const DieOptions: React.FC<DieOptionsProps> = ({ onAddDie }) => {
    return (
        <div className="die-options">
            <DieButton imageName="d4" dieSides={4} onAddDie={onAddDie} />
            <DieButton imageName="d6" dieSides={6} onAddDie={onAddDie} />
            <DieButton imageName="d8" dieSides={8} onAddDie={onAddDie} />
            <DieButton imageName="d10" dieSides={10} onAddDie={onAddDie} />
            <DieButton imageName="d12" dieSides={12} onAddDie={onAddDie} />
            <DieButton imageName="d20" dieSides={20} onAddDie={onAddDie} />
        </div>
    )
}

export default DieOptions