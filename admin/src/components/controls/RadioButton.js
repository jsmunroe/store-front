import { useState } from "react";

export default function RadioButton({name, value, checked, children, onChange}) {
   return <label className={`form__radio ${checked ? 'checked' : ''}`}><input type="radio" name={name} value={value} checked={checked} onChange={onChange}></input> {children}</label>
}