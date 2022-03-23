import { forwardRef } from "react";
import useFieldState from "../../hooks/useFormState";

const Checkbox = forwardRef(({name, checked, children, className, onChange, onValidate, ...props}, ref) =>  {
    const [value, setValue] = useFieldState(name, onValidate);

    const handleChange = event => {
       setValue(event.target.checked);
       onChange && onChange(event);
    }
 
    const isChecked = typeof checked === 'undefined' ? value : checked;

    return <label className={`${className} ${checked ? 'checked' : ''}`} tabIndex={9000}><input type="checkbox" name={name} value={value} checked={isChecked} onChange={handleChange} ref={ref} {...props}></input> {children}</label>
});

export default Checkbox;