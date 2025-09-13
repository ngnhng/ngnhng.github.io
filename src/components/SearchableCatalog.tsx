import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';

interface Post {
  title: string;
  description: string;
  pubDate: string;
  image: string;
  imageAlt: string;
  slug: string;
  tags: string[];
}

interface SearchableCatalogProps {
  posts: Post[];
}

export default function SearchableCatalog({ posts }: SearchableCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Results */}
      {filteredPosts.length > 0 ? (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Featured Article</h2>
                <p className="text-muted-foreground">Latest insights and learnings</p>
              </div>
              <div className="group relative transition-all duration-300 hover:scale-[1.02] bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-border md:flex">
                <div className="relative overflow-hidden md:w-1/2 aspect-[16/9]">
                  <a href={`/notes/${featuredPost.slug}`} className="block group-hover:opacity-90 transition-opacity duration-300">
                    <div className="relative overflow-hidden">
                      <div className="transition-transform duration-500 transform group-hover:scale-110">
                        <img 
                          src={featuredPost.image.replace('/src/assets/', '/_astro/')} 
                          alt={featuredPost.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                  </a>
                </div>
                <div className="md:w-1/2 md:p-8 p-6">
                  <h2 className="font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 md:text-3xl text-xl leading-tight">
                    <a href={`/notes/${featuredPost.slug}`} className="hover:underline decoration-2 underline-offset-4">
                      {featuredPost.title}
                    </a>
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span className="font-medium">{featuredPost.pubDate}</span>
                  </div>
                  {featuredPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <a
                          key={tag}
                          href={`/tags/${tag}`}
                          className="inline-flex items-center text-xs font-medium rounded-full px-3 py-1.5 border transition-all duration-200 cursor-pointer bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* All Posts */}
          {remainingPosts.length > 0 && (
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">All Articles</h2>
                <p className="text-muted-foreground">Explore the complete collection</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <div key={post.slug} className="group relative h-full transition-all duration-300 hover:scale-[1.02] bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-border">
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <a href={`/notes/${post.slug}`} className="block group-hover:opacity-90 transition-opacity duration-300">
                        <div className="transition-transform duration-500 transform group-hover:scale-110">
                          <img 
                            src={post.image.replace('/src/assets/', '/_astro/')} 
                            alt={post.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="p-6">
                      <h2 className="font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 text-lg leading-snug">
                        <a href={`/notes/${post.slug}`} className="hover:underline decoration-2 underline-offset-4">
                          {post.title}
                        </a>
                      </h2>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span className="font-medium">{post.pubDate}</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <a
                              key={tag}
                              href={`/tags/${tag}`}
                              className="inline-flex items-center text-xs font-medium rounded-full px-3 py-1.5 border transition-all duration-200 cursor-pointer bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                            >
                              {tag}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-4">No articles found</h3>
            <p className="text-muted-foreground">
              No articles match your search query "{searchQuery}". Try different keywords or browse all articles.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}