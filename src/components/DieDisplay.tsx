import type Die from "./Die"
import DieImage from "./DieImage"

type DieDisplayProps = {
    die: Die
    handleClick?: (key: string) => void
}

const DieDisplay: React.FC<DieDisplayProps> = ({ die, handleClick }) => {


    return (
        <button draggable='true' className='die-display' onClick={() => handleClick ? handleClick(die.key) : null}>
            <DieImage imageName={`d${die.dieSides}`} alt={die.dieSides.toString()} />
            <h1 className="die-display-value">{die.dieValue}</h1>
        </button >
    )
}

export default DieDisplay