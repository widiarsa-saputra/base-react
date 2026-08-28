import { ReactNode } from "react"
import { Label } from "./ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Info } from "lucide-react"

type Props = React.ComponentProps<typeof Label> & {
    children: ReactNode,
    required?: boolean,
    tooltipMessage?: string
}

const LabelComp = ({
    children,
    required,
    tooltipMessage,
    ...props
}: Props) => {
    return (
        <Label className="flex font-medium capitalize gap-2 mb-2" {...props}>
            <span>
                {children}
            </span>
            {
                required && (
                    <span className="text-red-500">*</span>
                )
            }

            {tooltipMessage && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipMessage}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </Label>
    )
}

export default LabelComp;