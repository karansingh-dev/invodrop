import { Loader } from "lucide-react";

type BasicLoaderProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};
const BasicLoader = ({ className = "w-14 h-14" }: BasicLoaderProps) => {
  return (
    <div>
      <Loader className={`animate-spin w-14 h-14 ${className}`} />
    </div>
  );
};

export default BasicLoader;
