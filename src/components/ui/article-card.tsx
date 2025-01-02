import { Link } from "./link";

interface ArticleCardProps {
  category?: string;
  title?: string;
  author?: string;
  date?: string;
  large?: boolean;
  href: string;
  children?: any;
}

export function ArticleCard({
  category,
  title,
  author,
  date,
  large,
  href,
  children,
}: ArticleCardProps) {
  return (
    <Link href={href} className={`block group ${large ? "col-span-2" : ""}`}>
      <article className={`relative h-full ${large ? "md:flex" : ""}`}>
        <div
          className={`relative overflow-hidden rounded-lg ${
            large ? "md:w-1/2 aspect-[16/9]" : "aspect-[16/9]"
          }`}
        >
          {children}
          {large && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          )}
        </div>
        <div className={`${large ? "md:w-1/2 md:p-6 mt-4" : "mt-4"}`}>
          <div className="text-sm font-medium text-emerald-500 mb-2">
            {category}
          </div>
          <h2
            className={`font-semibold mb-2 wrap ${
              large ? "md:text-2xl" : "text-md"
            }`}
          >
            {title}
          </h2>
          <div className="flex items-center text-sm text-gray-400">
            <span>{author}</span>
            <span className="mx-2">·</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
