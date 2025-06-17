import DieImage from "./DieImage"

type DieButtonProps = {
    imageName?: string
    dieSides: number
    addGroup?: string | null
    onAddDie: (dieSides: number, groupKey?: string | null) => void
}

const DieButton: React.FC<DieButtonProps> = ({ imageName = 'd20', dieSides = 20, onAddDie, addGroup }) => {
    return (
        <button
            className='die-button'
            onClick={() => onAddDie(dieSides, addGroup)}
        >
            <DieImage imageName={imageName} />
        </button>
    )
}

export default DieButton