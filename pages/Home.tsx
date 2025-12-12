import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { BlogPost, Category } from '../types';
import { getPosts } from '../services/storageService';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div id="blog-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Filter by category to find exactly what you're looking for.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-10 flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="mt-12 grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {post.category}
                  </p>
                  <Link to={`/post/${post.id}`} className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">{post.author}</span>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {post.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.date}>{post.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
};