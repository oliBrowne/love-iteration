import { useId } from 'react';
import type { ComponentProps } from 'react';

type TextFieldProps = ComponentProps<'input'> & {
  label: string;
};

export function TextField({ label, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" {...props} />
    </div>
  );
}
