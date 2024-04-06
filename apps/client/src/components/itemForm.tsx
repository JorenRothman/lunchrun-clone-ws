import { useState } from "react";
import { clsx } from "clsx";
import Button from "@/components/button";

interface Props extends React.ComponentPropsWithoutRef<"form"> {
    submitHandler: (name: string) => boolean;
}

export default function ItemForm({ submitHandler }: Props) {
    const [name, setName] = useState("");
    const [isError, setIsError] = useState(false);

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name) {
            setIsError(true);
            return;
        }

        setIsError(false);

        const success = submitHandler(name);

        if (success) {
            setName("");
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="sticky bottom-0 left-0 right-0 py-4 px-2  mt-auto"
        >
            <div className="container flex md:px-4">
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={clsx(
                        "border-2 border-purple py-2 px-4 w-full focus:outline-none focus-visible:outline-none bg-white rounded-l-md",
                        {
                            "border-red-500": isError,
                        },
                    )}
                />
                <Button
                    type="submit"
                    size={"large"}
                    className="ml-[-1px] shrink-0 "
                    borderRadius={"right"}
                >
                    Add Item
                </Button>
            </div>
        </form>
    );
}
