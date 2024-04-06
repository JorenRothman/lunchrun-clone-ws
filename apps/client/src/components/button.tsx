import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/util/classname";

const styles = cva(
    "inline-flex items-center transition-all duration-100 shadow-md",
    {
        variants: {
            intent: {
                primary:
                    "bg-purple text-white border-2 border-purple hover:bg-yellow hover:text-purple",

                secondary:
                    "bg-pink text-purple border-2 border-purple hover:bg-purple hover:text-yellow",
            },
            size: {
                small: "px-2 py-1 gap-2 [&>svg]:size-4",
                medium: "px-2 py-1 gap-2  md:px-4 md:py-2 md:gap-3 [&>svg]:size-5",
                large: "px-4 py-3 gap-4 [&>svg]:size-6",
            },
            borderRadius: {
                left: "rounded-l-md",
                right: "rounded-r-md",
                both: "rounded-md",
            },
            isActive: {
                true: "bg-yellow text-purple",
            },
        },
        compoundVariants: [
            {
                isActive: true,
                intent: "primary",
                className: "bg-yellow text-black",
            },
        ],
        defaultVariants: {
            intent: "primary",
            size: "medium",
            borderRadius: "both",
        },
    },
);

interface Props
    extends React.ComponentPropsWithoutRef<"button">,
        VariantProps<typeof styles> {}

export default function Button({
    intent,
    size,
    borderRadius,
    className,
    isActive,
    ...props
}: Props) {
    return (
        <button
            className={cn(
                styles({ intent, size, borderRadius, isActive }),
                className,
            )}
            {...props}
        />
    );
}
