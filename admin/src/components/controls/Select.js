import { forwardRef } from "react";
import useFieldState from "../../hooks/useFormState";
import { toValue } from "../../utils/htmlHelpers";

const Select = forwardRef(({name, children, ...props}, ref) => {
    const [value, setValue] = useFieldState(name);

    return <select name={name} value={value} onChange={toValue(setValue)} ref={ref} {...props}>
        {children}
    </select>
})

export default Select;