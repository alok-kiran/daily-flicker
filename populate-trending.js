import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trendingArticles = [
  {
    title: "The Top 10 Best Computer Speakers in the Market",
    content: `<h2>Finding the Perfect Audio Setup</h2>
    <p>In today's digital age, having quality computer speakers can make all the difference in your audio experience. Whether you're a gamer, music enthusiast, or work-from-home professional, the right speakers can transform your daily computing experience.</p>
    
    <h3>What Makes Great Computer Speakers?</h3>
    <p>Great computer speakers combine several key factors: clear audio reproduction, adequate power output, connectivity options, and build quality. After extensive testing, we've compiled this list of the top 10 speakers that excel in these areas.</p>
    
    <h3>Our Top Picks</h3>
    <p>From budget-friendly options to premium audiophile choices, our selection covers speakers for every need and budget. Each speaker on this list has been thoroughly tested for sound quality, durability, and value for money.</p>
    
    <p>Whether you need speakers for gaming, music production, or general computer use, this comprehensive guide will help you make an informed decision for your audio needs.</p>`,
    excerpt: "Discover the best computer speakers that deliver exceptional audio quality for gaming, music, and productivity.",
    thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
    published: true,
    featured: true,
    tags: ["Technology", "Audio", "Reviews"]
  },
  {
    title: "Play This Game for Free on Steam This Weekend",
    content: `<h2>Weekend Gaming Special</h2>
    <p>Steam's free weekend promotions continue to delight gamers worldwide, and this weekend brings an exciting opportunity to experience a highly-rated game without spending a penny.</p>
    
    <h3>What's on Offer</h3>
    <p>This weekend's featured game combines stunning visuals with engaging gameplay mechanics that have earned it rave reviews from both critics and players. The free weekend includes access to the full game, allowing you to experience everything it has to offer.</p>
    
    <h3>How to Get Started</h3>
    <p>Simply visit the Steam store page, click the "Install Game" button, and you'll have immediate access. If you decide you love the game, you can purchase it at a significant discount during the promotional period.</p>
    
    <p>Don't miss this chance to discover your next favorite game without any upfront cost. The promotion runs from Friday evening through Sunday night.</p>`,
    excerpt: "Don't miss this weekend's free Steam game promotion featuring a highly-rated title available at no cost.",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Gaming", "Steam", "Free Games"]
  },
  {
    title: "At Value-Focused Hotels, the Free Breakfast Gets Bigger",
    content: `<h2>The Evolution of Hotel Breakfast</h2>
    <p>Budget and mid-range hotels are revolutionizing their breakfast offerings, transforming simple continental spreads into elaborate buffets that rival upscale establishments.</p>
    
    <h3>More Than Just Coffee and Pastries</h3>
    <p>Today's value-focused hotels understand that breakfast can be a major differentiator. Many now offer hot entrees, fresh fruit stations, yogurt bars, and even made-to-order options that were once exclusive to luxury properties.</p>
    
    <h3>The Business Case for Better Breakfast</h3>
    <p>Hotels have discovered that investing in breakfast pays dividends in customer satisfaction and loyalty. Guests appreciate starting their day well-fed, and families especially value the cost savings of not having to find breakfast elsewhere.</p>
    
    <p>This trend reflects the broader hospitality industry's focus on providing exceptional value, proving that you don't need to pay premium prices for premium experiences.</p>`,
    excerpt: "Budget hotels are upgrading their breakfast offerings to compete with luxury establishments and increase guest satisfaction.",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Travel", "Hotels", "Food"]
  },
  {
    title: "There May Be No Consoles in the Future, EA Exec Says",
    content: `<h2>The Changing Landscape of Gaming</h2>
    <p>Electronic Arts executives are predicting a major shift in how we play games, suggesting that traditional gaming consoles may become obsolete in the coming decades.</p>
    
    <h3>Cloud Gaming and Streaming</h3>
    <p>With the rise of cloud gaming services and powerful mobile devices, the need for dedicated gaming hardware is being questioned. Games can now be streamed directly to smartphones, tablets, and smart TVs with minimal latency.</p>
    
    <h3>The Subscription Model</h3>
    <p>The gaming industry is moving toward service-based models where players subscribe to access vast libraries of games rather than purchasing individual titles. This shift supports the argument for platform-agnostic gaming.</p>
    
    <h3>What This Means for Gamers</h3>
    <p>While this prediction may seem dramatic, it reflects the industry's movement toward accessibility and convenience. The future of gaming may be less about what device you own and more about having a good internet connection.</p>`,
    excerpt: "EA executives predict the end of gaming consoles as cloud gaming and streaming services reshape the industry.",
    thumbnail: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Gaming", "Technology", "Future"]
  },
  {
    title: "Failure is the Condiment That Gives Success Its Flavor",
    content: `<h2>Embracing Failure as a Learning Tool</h2>
    <p>In our success-obsessed culture, we often overlook the valuable lessons that failure provides. Yet some of history's most successful individuals credit their failures as crucial stepping stones to achievement.</p>
    
    <h3>The Psychology of Failure</h3>
    <p>Failure teaches resilience, humility, and problem-solving skills that success alone cannot provide. When we fail, we're forced to examine our assumptions, adapt our strategies, and develop emotional intelligence.</p>
    
    <h3>Famous Failures That Led to Success</h3>
    <p>From inventors to entrepreneurs, many successful people experienced significant failures before achieving their breakthroughs. These setbacks provided invaluable insights that informed their eventual success.</p>
    
    <h3>Reframing Our Relationship with Failure</h3>
    <p>By viewing failure as feedback rather than defeat, we can maintain the motivation needed to continue pursuing our goals. Each failure brings us closer to understanding what works and what doesn't.</p>`,
    excerpt: "Explore how embracing failure as a learning opportunity can be the key to achieving meaningful success.",
    thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Motivation", "Success", "Personal Development"]
  },
  {
    title: "The Rise of Remote Work: How Technology is Reshaping the Office",
    content: `<h2>The Remote Work Revolution</h2>
    <p>The global shift to remote work has fundamentally changed how we think about the traditional office environment. Technology has made it possible for teams to collaborate effectively from anywhere in the world.</p>
    
    <h3>Tools That Enable Remote Success</h3>
    <p>From video conferencing platforms to project management software, the tools available today make remote work not just possible, but often more efficient than traditional office setups. Cloud computing has eliminated the need for physical proximity to shared resources.</p>
    
    <h3>The Benefits Beyond Flexibility</h3>
    <p>Remote work offers advantages beyond the obvious flexibility. Companies report reduced overhead costs, access to global talent pools, and often increased productivity from employees who appreciate the trust and autonomy.</p>
    
    <h3>Challenges and Solutions</h3>
    <p>While remote work isn't without its challenges, innovative companies are finding creative solutions to maintain company culture, ensure effective communication, and support employee well-being in virtual environments.</p>`,
    excerpt: "Discover how remote work technology is transforming business operations and employee experiences worldwide.",
    thumbnail: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop",
    published: true,
    featured: true,
    tags: ["Technology", "Remote Work", "Business"]
  },
  {
    title: "Climate Change Solutions: Innovation in Renewable Energy",
    content: `<h2>Breakthrough Technologies in Clean Energy</h2>
    <p>As the urgency of climate change becomes increasingly apparent, innovative renewable energy technologies are emerging as beacons of hope for a sustainable future.</p>
    
    <h3>Solar Power Advances</h3>
    <p>Recent breakthroughs in solar panel efficiency and energy storage are making solar power more viable than ever. New materials and manufacturing processes are driving down costs while improving performance.</p>
    
    <h3>Wind Energy Innovation</h3>
    <p>Offshore wind farms and advanced turbine designs are unlocking previously untapped energy potential. These innovations are making wind power a dominant force in the renewable energy landscape.</p>
    
    <h3>The Role of Energy Storage</h3>
    <p>Advanced battery technologies and grid-scale storage solutions are solving the intermittency challenges that have long plagued renewable energy sources, making clean power available around the clock.</p>`,
    excerpt: "Explore the latest innovations in renewable energy technology that are accelerating the transition to clean power.",
    thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Environment", "Technology", "Energy"]
  },
  {
    title: "The Future of Electric Vehicles: What to Expect in 2024",
    content: `<h2>Electric Vehicle Market Acceleration</h2>
    <p>The electric vehicle industry is experiencing unprecedented growth, with 2024 promising to be a pivotal year for EV adoption and technological advancement.</p>
    
    <h3>Battery Technology Improvements</h3>
    <p>Next-generation battery technologies are addressing the key concerns of range anxiety and charging time. Solid-state batteries and improved lithium-ion chemistry are extending range while reducing charging times.</p>
    
    <h3>Charging Infrastructure Expansion</h3>
    <p>Governments and private companies are investing heavily in charging infrastructure, making long-distance electric travel more practical. Ultra-fast charging stations are becoming commonplace along major travel routes.</p>
    
    <h3>Price Parity on the Horizon</h3>
    <p>With decreasing battery costs and increasing production scale, electric vehicles are approaching price parity with traditional internal combustion engines, making them accessible to a broader market.</p>`,
    excerpt: "Learn about the exciting developments in electric vehicles that will shape transportation in 2024 and beyond.",
    thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=400&fit=crop",
    published: true,
    featured: false,
    tags: ["Electric Vehicles", "Technology", "Transportation"]
  }
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createTrendingContent() {
  try {
    console.log('🚀 Starting trending content creation...');

    // Find or create admin user
    let adminUser = await prisma.user.findUnique({
      where: { email: 'alokkiran777@gmail.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please run create-admin.js first');
      return;
    }

    console.log('✅ Found admin user:', adminUser.name);

    // Create trending category
    let trendingCategory;
    try {
      trendingCategory = await prisma.category.create({
        data: {
          name: 'Trending',
          slug: 'trending',
          description: 'The latest trending news and stories from around the world',
          color: '#FF6B6B' // Trending red color
        }
      });
      console.log('✅ Created trending category');
    } catch (error) {
      if (error.code === 'P2002') {
        trendingCategory = await prisma.category.findUnique({
          where: { slug: 'trending' }
        });
        console.log('✅ Trending category already exists');
      } else {
        throw error;
      }
    }

    // Create articles
    console.log('📝 Creating trending articles...');
    
    for (const article of trendingArticles) {
      const slug = generateSlug(article.title);
      
      try {
        // Create tags for the article
        const tagIds = [];
        for (const tagName of article.tags) {
          const tagSlug = generateSlug(tagName);
          
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
              name: tagName,
              slug: tagSlug,
              postIds: []
            }
          });
          
          tagIds.push(tag.id);
        }

        // Create the post
        await prisma.post.create({
          data: {
            title: article.title,
            slug,
            content: article.content,
            excerpt: article.excerpt,
            published: article.published,
            featured: article.featured,
            thumbnail: article.thumbnail,
            categoryId: trendingCategory.id,
            authorId: adminUser.id,
            publishedAt: article.published ? new Date() : null,
            tagIds
          }
        });

        console.log(`✅ Created article: ${article.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Article already exists: ${article.title}`);
        } else {
          console.error(`❌ Error creating article "${article.title}":`, error);
        }
      }
    }

    console.log('🎉 Trending content creation completed!');
    
  } catch (error) {
    console.error('❌ Error creating trending content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTrendingContent(); 