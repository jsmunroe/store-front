export default function Checkbox({name, value, title, checked, children, className, onChange}) {
    return <label className={`${className} ${checked ? 'checked' : ''}`} title={title} tabIndex={9000}><input type="checkbox" name={name} value={value} checked={checked} onChange={onChange}></input> {children}</label>
 }