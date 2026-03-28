import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    href?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    isLoading,
    className = "",
    disabled,
    href,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-accent text-white hover:bg-accent-hover",
        secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
        outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-white",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-lg",
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        if (href.startsWith("http")) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={combinedStyles}>
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedStyles}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;
