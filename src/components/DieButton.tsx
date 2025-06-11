import DieImage from "./DieImage"

type DieButtonProps = {
    imageName?: string
    dieSides: number
}

const DieButton: React.FC<DieButtonProps> = ({ imageName = 'd20', dieSides = 20 }) => {
    return (
        <button className='die-button'>
            <DieImage imageName={imageName} alt={dieSides.toString()} />
        </button>
    )
}

export default DieButton