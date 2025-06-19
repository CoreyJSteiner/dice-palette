import type { Collision, CollisionDetection } from '@dnd-kit/core'

export interface Rect {
    top: number
    left: number
    width: number
    height: number
    bottom: number
    right: number
}

export const createRect = (top: number, left: number, width: number, height: number): Rect => ({
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width
})

export const containsPoint = (rect: Rect, point: { x: number, y: number }): boolean => {
    return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
    )
}

export const getCenterZone = (rect: Rect, percentage = 0.6): Rect => {
    const widthMargin = rect.width * (1 - percentage) / 2
    const heightMargin = rect.height * (1 - percentage) / 2

    return createRect(
        rect.top + heightMargin,
        rect.left + widthMargin,
        rect.width * percentage,
        rect.height * percentage
    )
}

export const zoneCollisionDetection: CollisionDetection = (args) => {
    const { droppableContainers, droppableRects, pointerCoordinates } = args
    const collisions: Collision[] = []

    // We need the pointer coordinates
    if (!pointerCoordinates) return collisions

    const point = { x: pointerCoordinates.x, y: pointerCoordinates.y }

    for (const droppable of droppableContainers) {
        const rect = droppableRects.get(droppable.id)
        if (!rect) continue

        // Create our custom rect from the droppable
        const customRect = createRect(
            rect.top,
            rect.left,
            rect.width,
            rect.height
        )

        // Calculate center zone (60% of the area)
        const centerZone = getCenterZone(customRect)

        // Check if pointer is in center zone
        if (containsPoint(centerZone, point)) {
            collisions.push({
                id: droppable.id,
                data: { zone: 'center' }
            })
        }
    }

    return collisions
}