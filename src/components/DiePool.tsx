import type React from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import { zoneCollisionDetection } from '../utils/ZoneCollisionDetection'
import type { Die, PoolItem, PoolItemDie } from "./DiePalleteTypes"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent
} from "@dnd-kit/core"
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import { useState, useRef } from "react"
import { snapCenterToCursor } from "@dnd-kit/modifiers"
import DieAndValue from "./DieAndValue"

type DiePoolProps = {
    pool: PoolItem[]
    setPool: (newPool: React.SetStateAction<PoolItem[]>) => void
    dieClickHandler: (key: string) => void
    dieInGroupClickHandler: (groupKey: string, dieKey: string) => void
    clearClickHandler: () => void
    resetClickHandler: () => void
    addToGroupHandler: (dieData: Die, groupKey?: string | null) => void
    createGroupHandler: (dice: Array<Die>) => void
    destroyGroupHandler: (groupKey: string) => void
    rollDiceGroupHandler: (groupKey: string) => void
}

const DiePool: React.FC<DiePoolProps> = ({
    pool = [],
    setPool,
    clearClickHandler,
    resetClickHandler,
    dieClickHandler,
    dieInGroupClickHandler,
    addToGroupHandler,
    createGroupHandler,
    destroyGroupHandler,
    rollDiceGroupHandler
}) => {
    const [nestingTargetZone, setNestingTargetZone] = useState<'center' | 'margin' | null>(null)
    const [nestingTargetKey, setNestingTargetKey] = useState<string>('')
    const [activePoolItem, setActivePoolItem] = useState<PoolItem | null>(null)
    const hoverTimeout = useRef<number>(undefined)
    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)
    const sensors = useSensors(mouseSensor, touchSensor)

    // Handlers
    const handleDragStart = (e: DragStartEvent) => {
        setActivePoolItem(e.active.data.current as PoolItemDie || null)
        setNestingTargetKey('')
        clearTimeout(hoverTimeout.current)
    }

    const handleDragMove = (e: DragOverEvent) => {
        const { active, over, collisions } = e

        if (!over || !collisions || over.id === active.id) return

        const collisionSet = collisions.reduce((acc, c) => {
            if (c.id === over.id && c.data?.zone) {
                acc.add(c.data?.zone)
            } else {
                acc.add('default')
            }
            return acc
        }, new Set())

        console.log(collisionSet)

        clearTimeout(hoverTimeout.current)

        const activeData = active.data.current
        if (activeData?.details.groupKey) return
        const overData = over.data.current
        if (!overData) return

        if (collisionSet.has('center') && activeData?.type === 'die') {
            hoverTimeout.current = setTimeout(() => {
                setNestingTargetKey(over.id as string)
                setNestingTargetZone('center')
            }, 500) as unknown as number
        } else if (collisionSet.has('default')) {
            if (overData.type === 'group' || (overData.type === 'die' && overData.details.groupKey)) {
                const targetKey = overData.type === 'group' ? over.id : overData.details.groupKey
                setNestingTargetKey(targetKey as string)
                setNestingTargetZone('center')
            } else {
                setNestingTargetZone('margin')
                setNestingTargetKey(over.id as string)
            }
        } else {
            setNestingTargetKey('')
            setNestingTargetZone(null)
        }
    }

    const handleGrouping = (dieData: Die, targetData: PoolItem | null) => {
        if (nestingTargetKey === 'clear') addToGroupHandler(dieData, null)
        console.log('snluo');


        setNestingTargetKey('')
        if (dieData.key === targetData?.id
            || (dieData.groupKey && targetData?.type === 'die' && dieData.groupKey === targetData?.details.groupKey)
            || (targetData?.type === 'group' && dieData.groupKey && dieData.groupKey === targetData?.details.key)) return

        if (!targetData || (targetData.type === 'die' && dieData.groupKey && !targetData.details.groupKey)) {
            addToGroupHandler(dieData, null)
        } else if (targetData.type === 'group' || (targetData.type === 'die' && targetData.details.groupKey)) {
            console.log('blerkle');

            addToGroupHandler(
                dieData,
                targetData.type === 'die' ? targetData.details.groupKey : targetData.details.key
            )
        } else if (targetData.type === 'die' && !targetData.details.groupKey && !dieData.groupKey) {
            createGroupHandler([dieData, targetData.details])
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        setActivePoolItem(null)
        clearTimeout(hoverTimeout.current)
        const { active, over } = e

        const reset = () => {
            setNestingTargetKey('')
            setNestingTargetZone(null)
        }

        if (!active) {
            reset()
            return
        }

        const dieData = active.data.current?.details as Die
        const targetData: PoolItem | null = over?.data.current as PoolItem

        console.dir({
            dieData,
            targetData,
            nestingTargetKey,
            nestingTargetZone
        })

        if (over && active.id !== over.id && !dieData.groupKey) {
            console.log('checkity');

            if (nestingTargetZone === 'margin') {
                if (!dieData.groupKey) {
                    setPool((prevPool: PoolItem[]): PoolItem[] => {
                        const oldIndex = prevPool.findIndex(item => item.id === active.id)
                        const newIndex = prevPool.findIndex(item => item.id === over.id)

                        if (oldIndex === -1 || newIndex === -1) return prevPool

                        const updated = [...prevPool]
                        const [movedItem] = updated.splice(oldIndex, 1)
                        updated.splice(newIndex, 0, movedItem)

                        return updated
                    })
                } else {
                    handleGrouping(dieData, null)
                }

            } else if (
                nestingTargetZone === 'center' ||
                (targetData.type === 'die' && targetData.details.groupKey) ||
                targetData.type === 'group'
            ) {
                handleGrouping(dieData, targetData)
            }
        } else if (dieData.groupKey && (!targetData || targetData.id !== dieData.groupKey)) {
            handleGrouping(dieData, null)
        }

        reset()
    }

    // Pool Item Element
    const poolItemDisplay = (poolItem: PoolItem) => {
        const isActive = nestingTargetKey === poolItem.id
        const isCenter = nestingTargetZone === 'center'
        const isMargin = nestingTargetZone === 'margin'

        if (poolItem.type === 'group') {
            return <DiceGroupDisplay
                key={poolItem.details.key}
                poolDragState={nestingTargetKey !== ''}
                poolHoverActive={isActive && isMargin}
                poolHoverCenter={isActive && isCenter}
                diceGroup={poolItem.details}
                dieInGroupClickHandler={dieInGroupClickHandler}
                destroyGroupHandler={destroyGroupHandler}
                rollDiceGroupHandler={rollDiceGroupHandler}
            />
        } else {
            return <DieDisplay
                key={poolItem.details.key}
                poolHoverActive={isActive && isMargin}
                poolHoverCenter={isActive && isCenter}
                die={poolItem.details}
                dieClickHandler={dieClickHandler}
            />
        }
    }

    return (
        <div className="die-pool-container">
            <DndContext
                sensors={sensors}
                collisionDetection={(args) => {
                    const cornerCollisions = closestCorners(args)
                    const zoneCollisions = zoneCollisionDetection(args)

                    return [...cornerCollisions, ...zoneCollisions]
                }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
                onDragCancel={() => {
                    clearTimeout(hoverTimeout.current)
                    setNestingTargetKey('')
                    setNestingTargetZone(null)
                }}
            >
                <SortableContext
                    items={pool.map(item => item.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className="die-pool">
                        {pool.map(poolItem => poolItemDisplay(poolItem))}
                    </div>
                </SortableContext>

                <div className="button-bottom-container">
                    <button className="button-bottom" onClick={resetClickHandler}>Reset Dice</button>
                    <button className="button-bottom" onClick={clearClickHandler}>Clear Palette</button>
                </div>

                <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
                    {activePoolItem ? (
                        activePoolItem.type === 'die' ?
                            <div className='die-display' style={{ opacity: '0.5' }}>
                                <DieAndValue die={activePoolItem.details} />
                            </div> :
                            <div className="dice-group-container">
                                <div className="dice-group-collapse-cover">
                                    <h1 className='dice-group-collapse-display'>{
                                        activePoolItem.details.dice.reduce((sum, die) => {
                                            const val = die.dieValue ? die.dieValue : 0
                                            return sum + val
                                        }, 0)
                                    }</h1>
                                </div>
                            </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default DiePool