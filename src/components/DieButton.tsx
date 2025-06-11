import DieImage from "./DieImage"

type DieButtonProps = {
    imageName?: string
    dieSides: number
    onAddDie: (dieSides: number) => void
}

const DieButton: React.FC<DieButtonProps> = ({ imageName = 'd20', dieSides = 20, onAddDie }) => {
    return (
        <button className='die-button' onClick={() => onAddDie(dieSides)}>
            <DieImage imageName={imageName} alt={dieSides.toString()} />
        </button>
    )
}

export default DieButton