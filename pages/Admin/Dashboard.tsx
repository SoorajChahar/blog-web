import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost } from '../../services/storageService';
import { BlogPost } from '../../types';
import { Plus, Edit, Trash, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const loadPosts = () => {
    setPosts(getPosts());
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadPosts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your blog content</p>
          </div>
          <Link
            to="/admin/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {posts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post.id}>
                  <div className="block hover:bg-gray-50 transition-colors">
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0">
                           <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">{post.title}</p>
                            <p className="mt-1 flex items-center text-sm text-gray-500">
                              <span className="truncate">{post.category}</span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div className="text-sm text-gray-900">
                              Posted on <time dateTime={post.date}>{post.date}</time>
                            </div>
                            <div className="mt-1 text-sm text-gray-500 truncate">
                              by {post.author}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/admin/edit/${post.id}`}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
              <div className="mt-6">
                <Link
                  to="/admin/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};