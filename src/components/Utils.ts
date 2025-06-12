import { isoLines } from "marching-squares";

export const generateSvgPathFromImage = async (
    imageUrl: string,
    threshold: number = 128
): Promise<string> => {
    // Load and decode the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    await img.decode();

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);

    // Get image data and process alpha channel
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    const alphaMatrix: number[][] = [];

    for (let y = 0; y < img.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            row.push(imageData[idx + 3]); // Alpha channel
        }
        alphaMatrix.push(row);
    }

    // Generate polygon points from alpha matrix
    const polygonPoints = isoLines(alphaMatrix, [threshold, 255], { noFrame: true })[1];

    // Convert to SVG path
    let svgPath = '';
    for (let i = 0; i < polygonPoints.length; i += 2) {
        const x = polygonPoints[i];
        const y = polygonPoints[i + 1];
        if (i === 0) {
            svgPath += `M ${x} ${y}`;
        } else {
            svgPath += ` L ${x} ${y}`;
        }
    }

    // Close the path if it's not empty
    if (svgPath) {
        svgPath += ' Z';
    }

    return svgPath;
};

// Example usage:
// const svgPath = await generateSvgPathFromImage('path/to/image.png');
// Then use in SVG: <path d={svgPath} fill="currentColor" />