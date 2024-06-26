"use client"

import ToolTip from "@/components/misc/tool-tip"
import { ToggleGroup, ToggleGroupItem } from "../toggle-group"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { effectsIcons } from "@/components/misc/displays/effects-icon"

export default function ToggleGroups({ data, value, onValueChange, tooltip }: Props) {
  /* Needed to create a state for the values to render and update */
  const [values, setValues] = useState<string[]>(value || [])

  /* Needed to update both the state and onValueChange of the toggle group */
  function handleValueChange(value: string[]) {
    setValues(value)
    onValueChange(value)
  }

  function ToggleItemsWithToolTip() {
    return data.map((item, index) => {
      return (
        <ToggleGroupItem value={item.name}>
          <ToolTip text={item.name} variant="ghost" size="icon" type="button" classNames={cn([{ "flex flex-row gap-x-2": item.icon && item.name }])}>
            {item.icon}
            {item.name}
          </ToolTip>
        </ToggleGroupItem>
      )
    })
  }

  function ToggleItemsWithoutTooltip() {
    return data.map((item, index) => {
      return (
        <ToggleGroupItem value={item.name} className={cn(["flex flex-row items-center justify-center", { "flex flex-row gap-4": item.icon && item.name }])} type="button">
          {item.icon}
          {item.name}
        </ToggleGroupItem>
      )
    })
  }

  function ToogleItems() {
    return tooltip === true ? <ToggleItemsWithToolTip /> : <ToggleItemsWithoutTooltip />
  }

  return (
    <ToggleGroup className="py-14 flex flex-row flex-wrap" type="multiple" onValueChange={handleValueChange} value={values}>
      <ToogleItems />
    </ToggleGroup>
  )
}

type Props = {
  data: typeof effectsIcons,
  tooltip?: boolean,
  value: string[] | undefined,
  onValueChange(value: string[]): void,
}