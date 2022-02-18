export default function Checkbox({name, value, checked, children, className, onChange}) {
    return <label className={`${className} ${checked ? 'checked' : ''}`} tabIndex={9000}><input type="checkbox" name={name} value={value} checked={checked} onChange={onChange}></input> {children}</label>
 }