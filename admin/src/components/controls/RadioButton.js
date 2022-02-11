import { useState } from "react";

export default function RadioButton({name, value, checked, children, className, onChange}) {
   return <label className={`${className} ${checked ? 'checked' : ''}`}><input type="radio" name={name} value={value} checked={checked} onChange={onChange}></input> {children}</label>
}