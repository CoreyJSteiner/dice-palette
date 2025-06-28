import type { Die } from "./DiePalleteTypes"
import DieImage from "./DieImage"
import { type CSSProperties } from "react"

type DieDisplayProps = {
    die: Die
}

const DieAndValue: React.FC<DieDisplayProps> = ({
    die,
}) => {
    // CSS - Vars
    const styleValueFont: CSSProperties = {
        '--value-font-color': die.fontColor,
        '--value-font-border-color': die.fillColor,
        // '--value-font-border-color': 'black',
    } as CSSProperties

    return (
        <>
            <DieImage imageName={`d${die.dieSides}`} fillColor={die.fillColor} />
            <h1 className="die-display-value" style={styleValueFont} data-text={die.dieValue}>{die.dieValue}</h1>
        </>
    )
}

export default DieAndValue