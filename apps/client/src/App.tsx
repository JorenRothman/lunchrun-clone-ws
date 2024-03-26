import type { State } from "@repo/shared/types";
import { useEffect, useState } from "react";
import ItemForm from "./components/itemForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { HeartIcon, XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import {
    socket,
    deleteFavourite,
    addFavourite,
    deleteItem,
    addItem,
} from "./socket";
import Button from "./components/button";

const initialState: State = {
    items: [],
    favourites: [],
};

function isFavourite(name: string, state: State) {
    return state.favourites.find((favourite) => favourite.name === name);
}

function App() {
    const [state, setState] = useState(initialState);
    const [favouritesParent] = useAutoAnimate();
    const [itemsParent] = useAutoAnimate();

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect();
        }

        socket.on("update", (data: State) => {
            setState(data);
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, []);

    return (
        <div className="container mx-auto py-12 flex gap-12 flex-col font-geist">
            <div ref={favouritesParent}>
                <h2 className="mb-4 text-4xl">Favourites</h2>
                {state.favourites.length > 0 ? (
                    <ul className="flex gap-4 flex-wrap">
                        {state.favourites.map((favourite) => (
                            <div className="flex" key={favourite.id}>
                                <Button
                                    className="capitalize"
                                    onClick={() =>
                                        addItem(favourite.name, state)
                                    }
                                >
                                    {favourite.name}
                                </Button>
                                <Button
                                    className="ml-[-1px]"
                                    onClick={() =>
                                        deleteFavourite(favourite.id, state)
                                    }
                                >
                                    <XMarkIcon />
                                </Button>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xl">
                        There are currently no favourites, add some!
                    </p>
                )}
            </div>

            <div>
                <h2 className="mb-4 text-4xl">Items</h2>
                <div className="divide-y" ref={itemsParent}>
                    {state.items.map((item) => (
                        <div
                            key={item.id}
                            className="py-4 flex items-center border-black capitalize"
                        >
                            {item.name}
                            <div className="ml-auto flex gap-4">
                                <Button
                                    onClick={() => {
                                        const favourite = isFavourite(
                                            item.name,
                                            state,
                                        );

                                        if (favourite) {
                                            deleteFavourite(
                                                favourite.id,
                                                state,
                                            );
                                        } else {
                                            addFavourite(item.name, state);
                                        }
                                    }}
                                    intent={"secondary"}
                                >
                                    <HeartIcon
                                        className={clsx({
                                            "text-red-500": isFavourite(
                                                item.name,
                                                state,
                                            ),
                                        })}
                                    />
                                </Button>
                                <Button
                                    onClick={() => deleteItem(item.id, state)}
                                >
                                    <XMarkIcon />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <ItemForm submitHandler={(name) => addItem(name, state)} />
            </div>
        </div>
    );
}

export default App;
