import { BlogPost, Category } from '../types';

const STORAGE_KEY = 'lumina_blog_posts';

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is reshaping the way we build web applications.',
    content: 'Artificial Intelligence is rapidly transforming the landscape of web development. From intelligent code completion to automated testing and deployment, AI tools are empowering developers to work faster and more efficiently. \n\nOne of the most exciting areas is generative UI, where AI can draft entire interfaces based on simple text descriptions. However, the human touch remains essential for ensuring accessibility, user experience, and creativity. \n\nAs we look to the future, the collaboration between human developers and AI assistants will likely become the standard workflow, allowing for unprecedented levels of innovation.',
    author: 'Alex Rivera',
    date: '2023-10-15',
    category: Category.TECHNOLOGY,
    imageUrl: 'https://picsum.photos/800/400?random=1'
  },
  {
    id: '2',
    title: 'Top 10 Travel Destinations for 2024',
    excerpt: 'Discover the hidden gems and popular spots you must visit this year.',
    content: 'The world is full of amazing places waiting to be explored. In 2024, travelers are looking for a mix of adventure, relaxation, and cultural immersion. \n\nJapan remains a top favorite with its blend of ancient tradition and futuristic cities. Meanwhile, the pristine beaches of Albania are gaining popularity as an affordable European summer destination. For those seeking nature, the rugged landscapes of Patagonia offer an unforgettable experience.',
    author: 'Sarah Jenkins',
    date: '2023-11-02',
    category: Category.TRAVEL,
    imageUrl: 'https://picsum.photos/800/400?random=2'
  },
  {
    id: '3',
    title: 'Minimalism: A Guide to Simple Living',
    excerpt: 'How decluttering your space can lead to a clearer mind and a happier life.',
    content: 'Minimalism is more than just an aesthetic; it is a lifestyle choice that emphasizes quality over quantity. By removing the excess from our lives, we make room for what truly matters.\n\nStart small by decluttering a single drawer or closet. Ask yourself if each item brings value or joy. Over time, this practice creates a serene environment that fosters focus and reduces stress.',
    author: 'Marcus Chen',
    date: '2023-12-10',
    category: Category.LIFESTYLE,
    imageUrl: 'https://picsum.photos/800/400?random=3'
  }
];

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_POSTS));
    return MOCK_POSTS;
  }
  return JSON.parse(stored);
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};