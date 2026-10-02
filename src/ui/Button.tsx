import type { ButtonHTMLAttributes } from 'react';

export function Button({
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="button" type={type} {...props} />;
}
