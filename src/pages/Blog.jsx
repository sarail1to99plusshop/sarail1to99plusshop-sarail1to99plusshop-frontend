import { FiCalendar, FiArrowRight } from 'react-icons/fi';

const blogPosts = [
  {
    id: 1,
    title: 'How to Care for Non-Stick Cookware & Make It Last 3x Longer',
    snippet: 'Essential kitchen tips for using silicone spatulas, mild sponge cleaning, and preventing thermal shock on granite frying pans.',
    date: 'Oct 05, 2026',
    author: 'Sarail 1 to 99 Team',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    category: 'Kitchen Tips',
  },
  {
    id: 2,
    title: 'Top 7 Space-Saving Home Storage Ideas for Small Rooms',
    snippet: 'Discover collapsible clothes organizers, stackable shoe racks, and multipurpose kitchen hanging shelves that save 70% space.',
    date: 'Sep 28, 2026',
    author: 'Home Stylist',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    category: 'Home & Household',
  },
  {
    id: 3,
    title: 'Why Pure Melamine Dinnerware is Best for Everyday Family Dining',
    snippet: 'Safe, heat-resistant, shatterproof, and beautifully patterned dinner sets designed for modern Bangladeshi households.',
    date: 'Sep 15, 2026',
    author: 'Lifestyle Expert',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80',
    category: 'Crockery',
  },
];

const Blog = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-charcoal">
          Home, Kitchen & Lifestyle Blog
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Practical household tips, recipes, crockery guides & organization ideas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-48 overflow-hidden bg-gray-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-actionRed">
                  {post.category}
                </span>
                <h2 className="font-bold text-sm md:text-base text-charcoal mt-1 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                  {post.snippet}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {post.date}
                </span>
                <span className="text-primary font-semibold flex items-center gap-1 hover:text-actionRed cursor-pointer">
                  Read More <FiArrowRight />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
