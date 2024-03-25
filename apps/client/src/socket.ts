import { io } from 'socket.io-client';
import { env } from './env';
import type { State } from '@repo/shared/types';
import { randomString } from '@repo/shared/utils';

export const socket = io(env.VITE_SERVER_URL, {});

export function addItem(name: string, state: State) {
    socket.emit('update', {
        ...state,
        items: [
            ...state.items,
            {
                id: randomString(),
                name: name,
            },
        ],
    });

    return true;
}

export function deleteItem(id: string, state: State) {
    socket.emit('update', {
        ...state,
        items: state.items.filter((item) => item.id !== id),
    });
}

export function addFavourite(name: string, state: State) {
    // Check if item is already in favourites
    if (state.favourites.find((favourite) => favourite.name === name)) {
        return;
    }

    socket.emit('update', {
        ...state,
        favourites: [
            ...state.favourites,
            {
                id: randomString(),
                name,
            },
        ],
    });
}

export function deleteFavourite(id: string, state: State) {
    socket.emit('update', {
        ...state,
        favourites: state.favourites.filter((favourite) => favourite.id !== id),
    });
}
