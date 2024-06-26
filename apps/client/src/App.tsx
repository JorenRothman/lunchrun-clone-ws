import type { State } from "@repo/shared/types";
import { useEffect, useState } from "react";
import ItemForm from "@/components/itemForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { HeartIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
    socket,
    deleteFavourite,
    addFavourite,
    deleteItem,
    addItem,
} from "@/socket";
import Button from "@/components/button";
import { useLocalStorage } from "usehooks-ts";
import Disconnected from "@/components/disconnected";
import { cn } from "@/lib/util/classname";

const initialState: State = {
    items: [],
    favourites: [],
};

function getFavourite(name: string, state: State) {
    return state.favourites.find((favourite) => favourite.name === name);
}

function App() {
    const [localState, setLocalState] = useLocalStorage<State>(
        "local_state",
        initialState,
    );
    const [state, setState] = useState(localState);
    const [connected, setConnected] = useState(socket.connected);
    const [favouritesParent] = useAutoAnimate();
    const [itemsParent] = useAutoAnimate();

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect();
        }

        socket.on("update", (data: State) => {
            setState(data);
            setLocalState(data);
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [setLocalState]);

    useEffect(() => {
        const connection = socket.connected;

        setConnected(connection);

        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, [setConnected]);

    return (
        <div className="polka-bg min-h-dvh flex flex-col">
            {!connected && <Disconnected />}

            <div className="container mx-auto py-6 md:py-12 flex gap-6 md:gap-12 flex-col font-geist">
                <div>
                    <h2 className="mb-4 text-2xl font-light">Favourites</h2>
                    <div
                        ref={favouritesParent}
                        className="flex gap-4 flex-wrap py-3 px-4 border-black border bg-white rounded-md shadow-md"
                    >
                        {state.favourites.length > 0 ? (
                            <>
                                {state.favourites.map((favourite) => (
                                    <div className="flex" key={favourite.id}>
                                        <Button
                                            className="capitalize"
                                            borderRadius={"left"}
                                            onClick={() =>
                                                addItem(favourite.name, state)
                                            }
                                        >
                                            {favourite.name}
                                        </Button>
                                        <Button
                                            className="ml-[-1px]"
                                            borderRadius={"right"}
                                            intent={"primary"}
                                            onClick={() =>
                                                deleteFavourite(
                                                    favourite.id,
                                                    state,
                                                )
                                            }
                                        >
                                            <XMarkIcon />
                                        </Button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>There are currently no favourites, add some!</p>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-2xl font-light">Items</h2>
                    <div className="py-3 px-4 border-black border bg-white rounded-md shadow-md">
                        <div className="divide-y" ref={itemsParent}>
                            {state.items.map((item) => {
                                const favourite = getFavourite(
                                    item.name,
                                    state,
                                );
                                return (
                                    <div
                                        key={item.id}
                                        className="py-4 flex items-center border-black capitalize"
                                    >
                                        {item.name}
                                        <div
                                            className={cn("ml-auto flex gap-4")}
                                        >
                                            <Button
                                                isActive={!!favourite}
                                                onClick={() => {
                                                    if (favourite) {
                                                        deleteFavourite(
                                                            favourite.id,
                                                            state,
                                                        );
                                                    } else {
                                                        addFavourite(
                                                            item.name,
                                                            state,
                                                        );
                                                    }
                                                }}
                                            >
                                                <HeartIcon />
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deleteItem(item.id, state)
                                                }
                                            >
                                                <XMarkIcon />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <ItemForm submitHandler={(name) => addItem(name, state)} />
        </div>
    );
}

export default App;
