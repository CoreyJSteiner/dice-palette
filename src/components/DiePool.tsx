// --- DiePool.tsx ---
import type React from "react"
import DieDisplay from "./DieDisplay"
import DiceGroupDisplay from "./DiceGroupDisplay"
import type { Die, PoolItem, PoolItemDie } from "./DiePalleteTypes"
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
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
    const [nestingTargetKey, setNestingTargetKey] = useState<string>('')
    const [activePoolItem, setActivePoolItem] = useState<PoolItemDie | null>(null)
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

    const handleDragOver = (e: DragOverEvent) => {
        if (!e.over) return
        const { active, over } = e
        const activeItemKey = active.id as string
        const hoverItemKey = over.id as string
        if (hoverItemKey !== nestingTargetKey) {
            clearTimeout(hoverTimeout.current)
            hoverTimeout.current = setTimeout(() => {
                if (hoverItemKey !== activeItemKey) {
                    setNestingTargetKey(hoverItemKey)
                } else {
                    setNestingTargetKey('')
                }
            }, 500)
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        setActivePoolItem(null)
        clearTimeout(hoverTimeout.current)
        const { active, over } = e
        const dieData = active.data.current?.details as Die
        const targetData: PoolItem | null = over ? over.data.current as PoolItem : null

        if (nestingTargetKey) {
            setNestingTargetKey('')
            if (dieData.key === targetData?.id
                || (dieData.groupKey && targetData?.type === 'die' && dieData.groupKey === targetData?.details.groupKey)
                || (targetData?.type === 'group' && dieData.groupKey && dieData.groupKey === targetData?.details.key)) return

            if (!targetData || (targetData.type === 'die' && dieData.groupKey && !targetData.details.groupKey)) {
                addToGroupHandler(dieData, null)
            } else if (targetData.type === 'group' || (targetData.type === 'die' && targetData.details.groupKey)) {
                addToGroupHandler(
                    dieData,
                    targetData.type === 'die' ? targetData.details.groupKey : targetData.details.key
                )
            } else if (targetData.type === 'die' && !dieData.groupKey) {
                createGroupHandler([dieData, targetData.details])
            }
        } else if (over && active.id !== over.id) {
            setPool((prevPool: PoolItem[]): PoolItem[] => {
                const oldIndex: number = prevPool.findIndex((item: PoolItem) => item.id === active.id)
                const newIndex: number = prevPool.findIndex((item: PoolItem) => item.id === over.id)

                if (oldIndex < 0 || newIndex < 0) {
                    return prevPool
                }

                const updated: PoolItem[] = [...prevPool]
                const [movedItem] = updated.splice(oldIndex, 1)
                updated.splice(newIndex, 0, movedItem)

                return updated
            })
        }
    }

    // Pool Item Element
    const poolItemDisplay = (poolItem: PoolItem) => {
        if (poolItem.type === 'group') {
            return <DiceGroupDisplay
                key={poolItem.details.key}
                poolDragState={nestingTargetKey !== ''}
                poolHoverActive={nestingTargetKey === poolItem.id}
                diceGroup={poolItem.details}
                dieInGroupClickHandler={dieInGroupClickHandler}
                destroyGroupHandler={destroyGroupHandler}
                rollDiceGroupHandler={rollDiceGroupHandler}
            />
        } else {
            return <DieDisplay
                key={poolItem.details.key}
                poolHoverActive={nestingTargetKey === poolItem.id}
                die={poolItem.details}
                dieClickHandler={dieClickHandler}
            />
        }
    }

    return (
        <div className="die-pool-container">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragCancel={() => clearTimeout(hoverTimeout.current)}
            >
                <SortableContext
                    items={pool.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
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
                        <div className='die-display'>
                            <DieAndValue die={activePoolItem.details} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default DiePool