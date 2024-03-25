export default function useLocalStorage<T>(key: string, initialValue: T) {
    const get = () => {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value) as T;
        }
        return initialValue;
    };

    const set = (value: T) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [get, set] as const;
}
