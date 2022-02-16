export default function RadioButton({name, value, checked, children, className, onChange}) {
   return <label className={`${className} ${checked ? 'checked' : ''}`} tabIndex={9000}><input type="radio" name={name} value={value} checked={checked} onChange={onChange}></input> {children}</label>
}