import { forwardRef } from "react";
import useFieldState from "../../hooks/useFormState";
import { toValue } from "../../utils/htmlHelpers";
import { sendRef } from "../../utils/reactHelpers";

const Select = forwardRef(({name, children, ...props}, ref) => {
    const [value, setValue] = useFieldState(name);

    const handleChange = value => {
        setValue(value);
    }

    const getRef = ref => {
        return dom => {
            if (typeof value === 'undefined' && dom?.value) {
                setValue(dom.value);
            }

            sendRef(dom, ref);
        }
    }

    return <select name={name} value={value} onChange={toValue(handleChange)} ref={getRef(ref)} {...props}>
        {children}
    </select>
})

export default Select;