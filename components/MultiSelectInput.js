import React from 'react'
import { concat } from "lodash"
import InkMultiSelect from 'ink-multi-select'

export default function SelectInput({
	onBlur,
	onChange,
	onFocus,
	value = [],
	...props
}) {
	React.useEffect(() => {
		onFocus()
		return onBlur
	}, [onFocus, onBlur])
	return (
		<InkMultiSelect
			{...props}
			onSelect={({ value: v }) => onChange(concat(value, v))}
			onUnselect={({ value: v }) => onChange(value.filter(item => item !== v))}
		/>
	)
}
