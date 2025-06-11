import type Die from "./Die"
import DieImage from "./DieImage"

type DieDisplayProps = {
    die: Die
}

const DieDisplay: React.FC<DieDisplayProps> = ({ die }) => {
    return (
        <button className='die-display'>
            <DieImage imageName={`d${die.dieSides}`} alt={die.dieSides.toString()} />
            <h1 className="die-display-value" rolled-value={die.dieValue}>{die.dieValue}</h1>
        </button>
    )
}

export default DieDisplay