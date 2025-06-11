import DieButton from "./DieButton"

const DieOptions = () => {
    return (
        <div className="die-options">
            <DieButton imageName="d4" dieSides={4} />
            <DieButton imageName="d6" dieSides={6} />
            <DieButton imageName="d8" dieSides={8} />
            <DieButton imageName="d10" dieSides={10} />
            <DieButton imageName="d12" dieSides={12} />
            <DieButton imageName="d20" dieSides={20} />
        </div>
    )
}

export default DieOptions