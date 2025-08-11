type InvoDropLogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

export default function InvoDropLogo({
  className = "w-20",
  ...props
}: InvoDropLogoProps) {
  return (
    <img
      src="/assets/invodrop.png"
      alt="InvoDrop Logo"
      className={className}
      {...props}
    />
  );
}
