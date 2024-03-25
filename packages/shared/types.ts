export interface Item {
    id: string;
    name: string;
}

export interface Favourite {
    id: string;
    name: string;
}

export interface State {
    items: Item[];
    favourites: Favourite[];
}
