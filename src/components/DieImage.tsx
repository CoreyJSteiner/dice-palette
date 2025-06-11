type DieImageProps = {
    imageName?: string
    alt?: string
}

const IMG_BASE_PATH = '../../'

const DieImage: React.FC<DieImageProps> = ({ imageName = 'd20' }) => {
    return (
        <div className='die-img-container'>
            <img draggable='false' className='die-img' src={IMG_BASE_PATH + imageName + '.png'} />
            <img draggable='false' className='die-fill' src={IMG_BASE_PATH + imageName + "_fill.png"} />
        </div>
    )
}

export default DieImage