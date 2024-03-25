import { useState } from 'react';
import { clsx } from 'clsx';

interface Props extends React.ComponentPropsWithoutRef<'form'> {
    submitHandler: (name: string) => boolean;
}

export default function ItemForm({ submitHandler }: Props) {
    const [name, setName] = useState('');
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
            setName('');
        }
    }

    return (
        <form onSubmit={onSubmit} className="mt-8 flex">
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={clsx('border border-black p-2', {
                    'border-red-500': isError,
                })}
            />
            <button
                type="submit"
                className="bg-black text-white px-6 py-2 h-full border border-black"
            >
                Add Item
            </button>
        </form>
    );
}
