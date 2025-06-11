import DieImage from "./DieImage"

type DieDisplayProps = {
    imageName?: string
    dieSides: number
}

const DieDisplay: React.FC<DieDisplayProps> = ({ imageName = 'd20', dieSides = 20 }) => {
    return (
        <button className='die-display'>
            <DieImage imageName={imageName} alt={dieSides.toString()} />
        </button>
    )
}

export default DieDisplay