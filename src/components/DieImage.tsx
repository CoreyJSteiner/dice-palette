import type { CSSProperties } from 'react'

type DieImageProps = {
    imageName?: string
    fillColor?: string
}

const IMG_BASE_PATH = 'assets/'

const DieImage: React.FC<DieImageProps> = ({ imageName = 'd20', fillColor = 'red' }) => {

    // CSS - Vars
    const styleFill: CSSProperties = {
        '--fill-color': fillColor,
    } as CSSProperties

    // CSS - Fill Mask
    const maskStyle: CSSProperties = {
        maskImage: `url(${IMG_BASE_PATH}${imageName}_fill.png)`,
        WebkitMaskImage: `url(${IMG_BASE_PATH}${imageName}_fill.png)`,
    } as CSSProperties

    return (
        <div className='die-img-container' style={styleFill}>
            <img
                draggable='false'
                className='die-img'
                src={IMG_BASE_PATH + imageName + '.png'
                } />
            <div
                className='die-fill'
                style={maskStyle}
            />
        </div>
    )
}

export default DieImage