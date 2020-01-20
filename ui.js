

import React from 'react'
import { Form, Field } from 'react-final-form'
import { AppContext, Box, Color, Text } from 'ink'
import TextInput from '../components/TextInput'
import MultiSelectInput from '../components/MultiSelectInput'

const roleList = [{
	label: "ADMIN",
	value: "ADMIN"
}, {
		label: "APPROVER",
		value: "APPROVER"
	}, {
		label: "SALES_REP",
		value: "SALES_REP"
	}, {
		label: "FIN OPS",
		value: "FIN_OPS"
	}, {
		label: "VIEWER",
		value: "VIEWER"
	},
{
	label: "SLATE ADMIN",
	value: "SLATE_ADMIN"
}, {
		label: "SLATE_APPROVER",
		value: "SLATE APPROVER"
	}, {
		label: "SLATE SUPPORT",
		value: "SLATE_SUPPORT"
	}, {
		label: "SLATE_OPS",
		value: "SLATE OPS"
	}, {
		label: "SLATE FIN OPS",
		value: "SLATE_FIN_OPS"
	},
	{
		label: "SLATE VIEWER",
		value: "SLATE_VIEWER"
	},
];

const fields = [
	{
		name: 'action',
		label: 'Enter new action name',
		validate: value => {
			if (!value) return 'Required'
		},
		format: value =>
			value
				? value
						.toLowerCase()
						.replace(/[^a-z \\-]/g, '')
						.replace(/ /g, '_')
				: '',
		placeholder: 'reports, logs, brands',
		Input: TextInput
	},
	{
		name: 'scope',
		label: 'Enter scope name',
		placeholder: 'Reports, Logs, Brands',
		format: value => value ? value : '',
		validate: value => {
			if (!value) return 'Required'
		},
		Input: TextInput
	},
	{
		name: 'roleScopes',
		label: 'Select roles Scopes to be included',
		Input: MultiSelectInput,
		inputConfig: {
			items: [
				{
					label: 'EXHIBITOR',
					value: 'EXHIBITOR'
				},
				{
					label: 'MEDIA AGENCY',
					value: 'MEDIA_AGENCY'
				},
				{
					label: 'SLATE ADMIN',
					value: 'SLATE_ADMIN'
				}
			]
		}
	},
	{
		name: 'readRoles',
		label: 'Select Read roles',
		Input: MultiSelectInput,
		inputConfig: {
			items: roleList
		}
	},
	{
		name: 'writeRoles',
		label: 'Select Write roles',
		Input: MultiSelectInput,
		inputConfig: {
			items: roleList
		}
	},
	{
		name: 'approverRoles',
		label: 'Select Approver roles',
		Input: MultiSelectInput,
		inputConfig: {
			items: roleList
		}
	},
]

function RolesAndScopesForm() {
	const [activeField, setActiveField] = React.useState(0)
	const [isFormSubmitted, submitForm] = React.useState(false)
	const [submission, setSubmission] = React.useState({
		action: "",
		scope: "",
		roleScopes: [],
		readRoles: [],
		writeRoles: [],
		approverRoles: []
	});
	const inputOrder = ["action",
		"scope",
		"roleScopes",
		"readRoles",
		"writeRoles",
		"approverRoles"];

	return isFormSubmitted ? (
		<AppContext.Consumer>
			{({ exit }) => {
				setTimeout(exit)
				return (
					<Box flexDirection="column" marginTop={1}>
						<Color blue>
							<Text bold>Values submitted:</Text>
						</Color>
						<Box>{JSON.stringify(submission, undefined, 2)}</Box>
					</Box>
				)
			}}
		</AppContext.Consumer>
	) : (
		<Form onSubmit={setSubmission}>
			{({ handleSubmit, validating }) => (
				<Box flexDirection="column">
					{fields.map(
						(
							{
								name,
								label,
								placeholder,
								format,
								validate,
								Input,
								inputConfig
							},
							index
						) => (
							<Field name={name} key={name} format={format} validate={validate}>
								{({ input, meta }) => (
									<Box flexDirection="column">
										<Box>
											<Text bold={activeField === index}>{label}: </Text>
											{activeField === index ? (
												<Input
													{...input}
													{...inputConfig}
													placeholder={placeholder}
													onSubmit={() => {
														if (meta.valid && !validating) {
															setActiveField(value => value + 1) // go to next field
															if (activeField === fields.length - 1) {
																// last field, so submit
																handleSubmit()
																submitForm(true)
															}
														} else {
															input.onBlur() // mark as touched to show error
														}
													}}
												/>
											) : (
												(input.value && <Text>{input.value}</Text>) ||
												(placeholder && <Color gray>{placeholder}</Color>)
											)}
											{meta.invalid && meta.touched && (
												<Box marginLeft={2}>
													<Color red>âœ–</Color>
												</Box>
											)}
											{meta.valid && meta.touched && meta.inactive && (
												<Box marginLeft={2}>
													<Color green>âœ”</Color>
												</Box>
											)}
										</Box>
										{meta.error && meta.touched && <Box>
											<Color red>{meta.error}</Color>
										</Box>}
									</Box>
								)}
							</Field>
						)
					)}
				</Box>
			)}
		</Form>
	)
}

const fs = require("fs");
const data = require("../slate_user_scopes.json");
const { forIn, includes } = require("lodash");


const action = "settings";
const scopeToAdd = { settings: "Settings" };

const readRoles = ["__EVERYONE__"];
const writeRoles = ["ADMIN", "APPROVER", "SALES_REP"];
const approverRoles = ["ADMIN", "APPROVER"];

data.scopes = { ...data.scopes, ...scopeToAdd };

const checkRoleIncluded = (roles, role) => includes(roles, "__EVERYONE__") || includes(roles, role);

forIn(data.roleScopes, (user, _) => {
  console.log(user, "1")
  forIn(user, (right, _) => {
    console.log(user, "2")
    forIn(right, (role, roleKey) => {
      console.log(right, "roleKey", roleKey)
      forIn(role, () => {
        console.log(role, "roleKey", roleKey)
        const rolesToAdd = [];
        if (checkRoleIncluded(readRoles, roleKey)) rolesToAdd.push("READ");
        if (checkRoleIncluded(writeRoles, roleKey)) rolesToAdd.push("WRITE");
        if (checkRoleIncluded(approverRoles, roleKey)) rolesToAdd.push("APPROVE");
        role[action] = rolesToAdd;
      });
    });
  });
});

fs.writeFileSync("./output/slate_user_scopes.json", JSON.stringify(data, null, 4));


export default RolesAndScopesForm
