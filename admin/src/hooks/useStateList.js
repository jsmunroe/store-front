import { useState } from "react";

export default function useStateList(initialItems = []) {
    const [items, setItems] = useState(initialItems);

    const add = item => setItems(items => [...items, item]);

    const remove = match => {
        if (typeof match === 'function') {
            setItems(items => items.filter(i => !match(i)))
        } 
        else {
            setItems(items => items.filter(i => i === match));
        }
    }
    
    const update = (item, match) => setItems(items => items.map(i => match(i) ? item : i));
    const clear = () => setItems([]);
    

    return {items, add, remove, update, clear}
}