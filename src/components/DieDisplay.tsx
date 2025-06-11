import type Die from "./Die"
import DieImage from "./DieImage"

type DieDisplayProps = {
    die: Die
    dieClickHandler?: (key: string) => void
}

const DieDisplay: React.FC<DieDisplayProps> = ({ die, dieClickHandler }) => {

    const handleRightClick = (e: React.MouseEvent) => {
        if (dieClickHandler) {
            e.preventDefault()
            dieClickHandler(die.key)
        }

    }

    return (
        <button draggable='true' className='die-display' onContextMenu={handleRightClick}>
            <DieImage imageName={`d${die.dieSides}`} alt={die.dieSides.toString()} />
            <h1 className="die-display-value">{die.dieValue}</h1>
        </button >
    )
}

export default DieDisplay