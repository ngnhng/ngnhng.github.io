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
  series?: string; // P9c27
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
  series, // P9c27
}: ArticleCardProps) {
  return (
    <article className={`relative h-full ${large ? "md:flex" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-lg ${
          large ? "md:w-1/2 aspect-[16/9]" : "aspect-[16/9]"
        }`}
      >
        {href ? (
          <Link href={href} className="block group">
            <div className="relative overflow-hidden rounded-lg">
              <div className="transition-transform transform group-hover:scale-105">
                {children}
              </div>
              {large && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              )}
            </div>
          </Link>
        ) : (
          children
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
          {href ? (
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <div className="flex items-center text-sm text-gray-400">
          <span>
            {date
              ? new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "Unknown date"}
          </span>
        </div>
        <div className="flex flex-wrap mt-2">
          {tags?.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <span
                key={tag}
                className="text-xs font-medium text-gray-500 bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2"
              >
                {tag}
              </span>
            </Link>
          ))}
        </div>
        {series && ( // P9c27
          <div className="text-sm text-gray-500 mt-2"> // P9c27
            Series: {series} // P9c27
          </div> // P9c27
        )} // P9c27
      </div>
    </article>
  );
}
