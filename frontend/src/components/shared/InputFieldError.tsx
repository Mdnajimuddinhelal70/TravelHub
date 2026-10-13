import { IInputErrorState } from "./getInputFieldError";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState | null;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  if (!state) return null;

  const errorMessage = state.errors?.[field]?.[0];

  if (!errorMessage) return null;

  return <p className="text-sm text-red-500">{errorMessage}</p>;
};

export default InputFieldError;
