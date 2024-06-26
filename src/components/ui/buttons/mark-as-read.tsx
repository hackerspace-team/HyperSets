import { CheckIcon, CircleIcon } from "@radix-ui/react-icons"
import { Button } from "../button"
import { useContext } from "react";
import { NavbarContext, TNavbarContext } from "@/context/navbar-provider";

type Props = {

}

export default function  MarkAsReadButton({ }: Props) {
  const { markAllAsRead } = useContext(NavbarContext) as TNavbarContext

  function handleClick(e: any) {
    e.preventDefault
    markAllAsRead()
  }

  return (
    <Button onClick={handleClick} variant="ghost" size="sm" className="group group-hover:text-primary px-0 ml-auto mr-10 text-xs font-semibold text-zinc-700 dark:text-zinc-50 hover:bg-transparent gap-1">
      <div className="relative flex justify-center w-5 h-5 translate-y-[2px]">
        <CheckIcon className="w-[18px] h-[18px] translate-x-[1px] translate-y-[-3px] absolute text-primary" />
        <CircleIcon className="w-4 h-4 group-hover:text-zinc" />
      </div>
      Mark all as read
    </Button>
  )
}