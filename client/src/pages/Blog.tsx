import { Link } from "wouter";
import { getAllBlogPosts } from "@/data/blogPosts";
import { Calendar, Clock, Tag, ArrowRight, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const blogPosts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:bg-[#0B1120] dark:bg-[#0B1120]">
      {/* Breadcrumb */}
      <div className="border-b bg-background/50 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Blog</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2A5F7F] text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Wellness Insights & Research
            </h1>
            <p className="text-xl text-white/90">
              Evidence-based articles on ashwagandha, stress management, and holistic wellness. 
              Learn from clinical research and expert insights.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>

                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="group/btn p-0 h-auto hover:bg-transparent">
                      <span className="mr-2">Read Article</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>{post.tags.length} tags</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[#1E3A5F] to-[#2A5F7F] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the Benefits?
          </h2>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            All our articles are based on clinical research using KSM-66® ashwagandha—the same premium extract in Optibio supplements.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary" className="bg-white dark:bg-[#1E3A5F] text-[#1E3A5F] hover:bg-white/90">
              Shop KSM-66® Ashwagandha
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
