import { forwardRef } from "react";
import useFieldState from "../../hooks/useFormState";


const RadioButton = forwardRef(({name, className, value: radioValue, checked, required, onValidate, onChange, children, ...props}, ref) => {
   const [value, setValue] = useFieldState(name, onValidate);

   const handleChange = event => {
      setValue(event.target.value);
      onChange && onChange(event);
   }

   const isChecked = typeof checked === 'undefined' ? radioValue === value : checked;

   return <label className={`${className} ${isChecked ? 'checked' : ''}`} tabIndex={9000}><input type="radio" name={name} value={radioValue} checked={isChecked} onChange={handleChange} ref={ref} {...props}></input> {children}</label>
});

export default RadioButton;