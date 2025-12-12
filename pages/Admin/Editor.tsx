import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, savePost } from '../../services/storageService';
import { generateBlogContent } from '../../services/geminiService';
import { BlogPost, Category } from '../../types';
import { Wand2, Save, ArrowLeft, Loader2 } from 'lucide-react';

export const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: Category.TECHNOLOGY,
    imageUrl: 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 100),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const post = getPostById(id);
      if (post) {
        setFormData(post);
      } else {
        navigate('/admin');
      }
    }
  }, [isEditing, id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.category) {
      setError("Please provide a Title and Category to generate content.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const generatedContent = await generateBlogContent(formData.title, formData.category);
      setFormData((prev) => ({ 
        ...prev, 
        content: generatedContent,
        excerpt: generatedContent.slice(0, 150) + "..." 
      }));
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate content. Ensure API_KEY is set in environment or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
      setError("Please fill in all required fields.");
      return;
    }

    const newPost: BlogPost = {
      id: isEditing && id ? id : Date.now().toString(),
      date: isEditing && formData.date ? formData.date : new Date().toISOString().split('T')[0],
      title: formData.title!,
      excerpt: formData.excerpt || '',
      content: formData.content!,
      author: formData.author!,
      category: formData.category as Category,
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/400',
    };

    savePost(newPost);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 rounded-lg shadow">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Enter post title"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="author"
                    id="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="imageUrl"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white ${isGenerating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="-ml-0.5 mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Write your post content here or use the AI generator..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Detailed content of your blog post.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <div className="mt-1">
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Brief summary shown on listing page"
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};