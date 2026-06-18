import Image from "next/image";

interface PublicLogoProps {
  className?: string;
  priority?: boolean;
}

export function PublicLogo({ className = "h-14 w-auto", priority }: PublicLogoProps) {
  return (
    <Image
      src="/logo-alt.png"
      alt="Zirel Joyería"
      width={1100}
      height={387}
      className={`public-logo ${className}`}
      priority={priority}
    />
  );
}
