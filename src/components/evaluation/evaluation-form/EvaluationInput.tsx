import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { InputType } from "../../../services/input-service/interfaces";
import { InputLabel } from "@mui/material";

interface EvaluationInputProps {
  name: string;
  options: string[];
  type: InputType.Number | InputType.String;
  variant: "outlined" | "filled" | "standard";
  size: "small" | "medium";
  onChange: (value: string) => void;
  value?: string;
}

const EvaluationInput: React.FC<EvaluationInputProps> = ({
  name,
  options,
  type,
  variant,
  size,
  value,
  onChange,
}) => {
  const label = name.toUpperCase();

  if (options.length > 0) {
    return (
      <>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          name={name}
          variant={variant}
          size={size}
          defaultValue={options[0]}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  }

  return (
    <TextField
      type={type === InputType.String ? "text" : "number"}
      label={label}
      name={name}
      variant={variant}
      size={size}
      required={true}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default EvaluationInput;
