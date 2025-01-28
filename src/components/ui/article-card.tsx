import { Link } from "./link";

interface ArticleCardProps {
  category?: string;
  title?: string;
  author?: string;
  date?: string;
  large?: boolean;
  href?: string;
  children?: any;
  tags?: string[];
}

export function ArticleCard({
  category,
  title,
  author,
  date,
  large,
  href,
  children,
  tags,
}: ArticleCardProps) {
  return href ? (
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
            {category?.toLocaleUpperCase()}
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
          <div className="flex flex-wrap mt-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-gray-500 bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  ) : (
    <article className={`relative h-full ${large ? "md:flex" : ""}`}>
      Not available
    </article>
  );
}
