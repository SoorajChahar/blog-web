import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/storageService';
import { BlogPost as BlogPostType } from '../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      setPost(foundPost);
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
          
          <div className="flex items-center space-x-2 text-sm text-indigo-600 font-semibold uppercase tracking-wide mb-2">
            <Tag className="h-4 w-4" />
            <span>{post.category}</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-200 pb-8">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl mr-4">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-96 w-full mb-10 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg prose-indigo mx-auto text-gray-500 bg-white p-8 rounded-lg shadow-sm">
          {post.content.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
          ))}
        </div>
      </article>
    </div>
  );
};