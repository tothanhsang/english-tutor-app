import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'ghost';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const styles: Record<string, string> = {
    primary: 'btn-primary focus-visible:ring-[var(--color-primary)]',
    accent: 'btn-accent focus-visible:ring-[var(--color-accent)]',
    ghost: 'bg-transparent border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10',
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
