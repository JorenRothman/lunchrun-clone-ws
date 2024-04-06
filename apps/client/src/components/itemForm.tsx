import { useState } from "react";
import { clsx } from "clsx";
import Button from "@/components/button";

interface Props extends React.ComponentPropsWithoutRef<"form"> {
    submitHandler: (name: string) => boolean;
}

export default function ItemForm({ submitHandler }: Props) {
    const [name, setName] = useState("");
    const [isError, setIsError] = useState(false);

    console.log({ isError });

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

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (isError) {
            setIsError(false);
        }

        setName(event.target.value);
    }

    return (
        <form
            onSubmit={onSubmit}
            className="sticky bottom-0 left-0 right-0 py-4 md:px-2  mt-auto"
        >
            <div className="container flex md:px-4">
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    className={clsx(
                        "border-2 border-purple-300 py-2 px-4 w-full focus:outline-none focus-visible:outline-none bg-white rounded-l-md",
                        {
                            "border-red-500 border-2": isError,
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
