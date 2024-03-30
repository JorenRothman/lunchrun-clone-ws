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
            className="fixed bottom-0 left-0 right-0 py-6 px-4 border-t-2 border-black bg-white"
        >
            <div className="container flex">
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={clsx(
                        "border border-black py-2 px-4 w-full focus:outline-none focus-visible:outline-none",
                        {
                            "border-red-500": isError,
                        },
                    )}
                />
                <Button
                    type="submit"
                    size={"large"}
                    className="ml-[-1px] shrink-0 "
                >
                    Add Item
                </Button>
            </div>
        </form>
    );
}
