import { forwardRef } from "react";
import useFieldState from "../../hooks/useFormState";

const TextBox = forwardRef(({name, onValidate, ...props}, ref) => {
    const [value, setValue] = useFieldState(name, onValidate);

    const handleChange = event => {
        setValue(event.target.value);
    };

    return <input type="text" name={name} value={value} onChange={handleChange} ref={ref} {...props} />
})

export default TextBox;