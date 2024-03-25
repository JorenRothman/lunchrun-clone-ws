import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../lib/util/classname";

const styles = cva("inline-flex items-center transition-colors duration-100", {
  variants: {
    intent: {
      primary: [
        "bg-black",
        "text-white",
        "border",
        "border-black",
        "hover:bg-white",
        "hover:text-black",
      ],
      secondary: [
        "bg-white",
        "text-black",
        "border",
        "border-black",
        "hover:bg-black",
        "hover:text-white",
      ],
    },
    size: {
      small: "px-2 py-1 gap-2 [&>svg]:size-4",
      medium: "px-4 py-2 gap-3 [&>svg]:size-5",
      large: "px-4 py-3 gap-4 [&>svg]:size-6",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

interface Props
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof styles> {}

export default function Button({ intent, size, className, ...props }: Props) {
  return (
    <button className={cn(styles({ intent, size }), className)} {...props} />
  );
}
