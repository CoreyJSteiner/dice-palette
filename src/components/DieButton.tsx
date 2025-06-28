import DieImage from "./DieImage"

type DieButtonProps = {
    imageName?: string
    dieSides: number
    fillColor?: string
    addGroup?: string | null
    onAddDie: (dieSides: number, groupKey?: string | null) => void
}

const DieButton: React.FC<DieButtonProps> = ({
    imageName = 'd20',
    dieSides = 20,
    fillColor = 'red',
    onAddDie, addGroup
}) => {
    return (
        <button
            className='die-button'
            onClick={() => onAddDie(dieSides, addGroup)}
        >
            <DieImage imageName={imageName} fillColor={fillColor} />
        </button>
    )
}

export default DieButton