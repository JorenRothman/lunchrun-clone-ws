import type { State } from "@repo/shared/types";
import { useEffect, useState } from "react";
import ItemForm from "./components/itemForm";

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

function App() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }

    socket.on("update", (data: State) => {
      console.log("update from server", data);
      setState(data);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto py-12 flex gap-12 flex-col font-geist">
      {state.favourites.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl">Favourites</h2>
          <ul className="flex gap-4 flex-wrap">
            {state.favourites.map((favourite) => (
              <div
                key={favourite.id}
                className="flex items-center gap-2 bg-black text-white px-3 py-2"
              >
                <button
                  className="leading-none"
                  onClick={() => addItem(favourite.name, state)}
                >
                  {favourite.name}
                </button>
                <button onClick={() => deleteFavourite(favourite.id, state)}>
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="mb-4 text-xl">Items</h2>
        <div className="divide-y">
          {state.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center border-black">
              {item.name}
              <div className="ml-auto flex gap-4">
                <Button
                  onClick={() => addFavourite(item.name, state)}
                  intent={"secondary"}
                >
                  <HeartIcon
                    className={clsx({
                      "text-red-500": state.favourites.find(
                        (favourite) => favourite.name === item.name
                      ),
                    })}
                  />
                </Button>
                <Button onClick={() => deleteItem(item.id, state)}>
                  Delete
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
