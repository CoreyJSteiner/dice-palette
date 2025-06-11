type DieImageProps = {
    imageName?: string
    alt?: string
}

const IMG_BASE_PATH = '../../'

const DieImage: React.FC<DieImageProps> = ({ imageName = 'd20' }) => {
    return (
        <div className='die-img-container'>
            <img className='die-img' src={IMG_BASE_PATH + imageName + '.png'} />
            <img className='die-fill' src={IMG_BASE_PATH + imageName + "_fill.png"} />
        </div>
    )
}

export default DieImage