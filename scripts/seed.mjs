import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const assessments = [
  {
    title: "Career Aptitude Assessment",
    description: "Discover which career paths align with your natural strengths, interests, and work style through a comprehensive personality and aptitude evaluation.",
    category: "Career Discovery",
    questionCount: 10,
    estimatedMinutes: 12,
    isPremium: false,
    questions: [
      { id: 1, text: "When working on a project, you prefer to:", options: ["Plan every detail before starting", "Dive in and figure it out as you go", "Collaborate with others on the approach", "Research thoroughly before acting"], order: 1 },
      { id: 2, text: "Which environment energizes you most?", options: ["A quiet office with focused work", "A busy, social workplace", "A mix of remote and in-person", "Outdoors or on-the-go"], order: 2 },
      { id: 3, text: "You feel most accomplished when you:", options: ["Solve a complex logical problem", "Help someone overcome a challenge", "Create something visually appealing", "Lead a team to a goal"], order: 3 },
      { id: 4, text: "How do you handle tight deadlines?", options: ["I thrive under pressure", "I plan ahead to avoid them", "I communicate and negotiate timelines", "I prioritize ruthlessly"], order: 4 },
      { id: 5, text: "Which of these activities sounds most appealing?", options: ["Writing code or analyzing data", "Counselling or coaching people", "Designing products or experiences", "Managing projects or strategy"], order: 5 },
      { id: 6, text: "Your friends would describe you as:", options: ["Analytical and logical", "Empathetic and caring", "Creative and imaginative", "Organized and dependable"], order: 6 },
      { id: 7, text: "When learning something new, you prefer:", options: ["Reading documentation or books", "Hands-on trial and error", "Watching tutorials or videos", "Learning from a mentor"], order: 7 },
      { id: 8, text: "Which skill would you most like to develop?", options: ["Technical / programming skills", "Communication / leadership", "Design / creativity", "Business / entrepreneurship"], order: 8 },
      { id: 9, text: "What motivates you most at work?", options: ["Solving hard problems", "Making an impact on people", "Building something new", "Growing in responsibility"], order: 9 },
      { id: 10, text: "Where do you see yourself in 5 years?", options: ["A technical expert in my domain", "A people manager or mentor", "Running my own venture", "A senior strategist or consultant"], order: 10 },
    ],
  },
  {
    title: "Technical Skills Proficiency",
    description: "Assess your technical knowledge across software development, data structures, algorithms, and modern tech stacks to identify strengths and growth areas.",
    category: "Technology",
    questionCount: 10,
    estimatedMinutes: 15,
    isPremium: false,
    questions: [
      { id: 1, text: "Which data structure uses LIFO (Last In, First Out) order?", options: ["Queue", "Stack", "Linked List", "Tree"], order: 1 },
      { id: 2, text: "What does REST stand for?", options: ["Remote Execution State Transfer", "Representational State Transfer", "Resource Endpoint Standard Technology", "Real-time Event Streaming Technology"], order: 2 },
      { id: 3, text: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], order: 3 },
      { id: 4, text: "Which of these is NOT a JavaScript framework?", options: ["React", "Angular", "Django", "Vue"], order: 4 },
      { id: 5, text: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Lookup", "Server Query Logic", "Standard Queue Language"], order: 5 },
      { id: 6, text: "In OOP, what is 'encapsulation'?", options: ["Inheriting properties from a parent class", "Bundling data and methods within a class", "Overriding parent class methods", "Creating multiple instances of a class"], order: 6 },
      { id: 7, text: "Which HTTP method is used to update a resource?", options: ["GET", "POST", "PUT", "DELETE"], order: 7 },
      { id: 8, text: "What is a 'promise' in JavaScript?", options: ["A guarantee that code will run", "An async operation that resolves or rejects", "A way to declare variables", "A type of loop construct"], order: 8 },
      { id: 9, text: "What does 'CI/CD' stand for?", options: ["Code Inspection / Code Delivery", "Continuous Integration / Continuous Delivery", "Cloud Infrastructure / Cloud Deployment", "Core Integration / Core Deployment"], order: 9 },
      { id: 10, text: "Which of these is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], order: 10 },
    ],
  },
  {
    title: "Leadership & Management Style",
    description: "Understand your leadership personality, decision-making approach, and team management style to unlock your potential as a future leader.",
    category: "Leadership",
    questionCount: 10,
    estimatedMinutes: 10,
    isPremium: false,
    questions: [
      { id: 1, text: "When your team disagrees, you typically:", options: ["Make the final call yourself", "Facilitate a group consensus", "Let the most experienced person decide", "Research best practices first"], order: 1 },
      { id: 2, text: "How do you give feedback to team members?", options: ["Direct and immediate", "Scheduled 1-on-1 meetings", "Written reports", "Only when asked"], order: 2 },
      { id: 3, text: "Your leadership style is best described as:", options: ["Authoritative — I set the vision", "Democratic — I value input", "Coaching — I develop people", "Delegative — I trust my team"], order: 3 },
      { id: 4, text: "When a project fails, you:", options: ["Take full responsibility publicly", "Analyze root causes with the team", "Quietly fix the process", "Move on and learn from it"], order: 4 },
      { id: 5, text: "How do you prioritize tasks for your team?", options: ["Impact vs. effort matrix", "Urgency and deadlines", "Team member preferences", "Business value first"], order: 5 },
      { id: 6, text: "What is most important in a team?", options: ["Individual excellence", "Psychological safety", "Clear processes", "Competitive drive"], order: 6 },
      { id: 7, text: "When hiring, you prioritize:", options: ["Technical skills above all", "Cultural fit and attitude", "Track record and experience", "Potential to grow fast"], order: 7 },
      { id: 8, text: "How do you handle an underperforming team member?", options: ["Performance improvement plan", "Coaching and mentoring", "Reassign to better-fit tasks", "Direct conversation about expectations"], order: 8 },
      { id: 9, text: "Your team's success is measured by:", options: ["Meeting deadlines", "Quality of output", "Team happiness and growth", "Business outcomes achieved"], order: 9 },
      { id: 10, text: "In high-pressure situations, you:", options: ["Stay calm and reassure the team", "Focus intensely on the problem", "Delegate and trust the team", "Escalate quickly if needed"], order: 10 },
    ],
  },
  {
    title: "Emotional Intelligence (EQ) Profile",
    description: "Measure your emotional awareness, empathy, and interpersonal effectiveness — key predictors of career success and workplace wellbeing.",
    category: "Soft Skills",
    questionCount: 10,
    estimatedMinutes: 10,
    isPremium: true,
    questions: [
      { id: 1, text: "When you feel frustrated at work, you:", options: ["Take a break and return later", "Address it immediately", "Vent to a trusted colleague", "Push through and ignore it"], order: 1 },
      { id: 2, text: "A colleague seems upset. You:", options: ["Ask if they're okay privately", "Give them space", "Mention it to your manager", "Wait to see if it affects work"], order: 2 },
      { id: 3, text: "You receive harsh criticism. You:", options: ["Reflect on what's valid in it", "Defend yourself immediately", "Feel hurt but move on", "Thank them and evaluate later"], order: 3 },
      { id: 4, text: "How often do you check in on your own emotions?", options: ["Constantly — I'm very self-aware", "When something goes wrong", "Rarely — I focus on tasks", "I journal or meditate regularly"], order: 4 },
      { id: 5, text: "When someone disagrees with you, you:", options: ["Seek to understand their view", "Stay firm in your position", "Find a middle ground", "Defer to avoid conflict"], order: 5 },
      { id: 6, text: "In a team conflict, your role is usually:", options: ["Mediator and peacemaker", "Advocate for the right answer", "Silent observer", "Problem-solver focused on facts"], order: 6 },
      { id: 7, text: "How well do you read others' emotions?", options: ["Very well — it's instinctive", "Somewhat — I miss cues sometimes", "Poorly — I focus on words", "I actively watch for nonverbal signals"], order: 7 },
      { id: 8, text: "You manage stress by:", options: ["Exercise or physical activity", "Talking it through with someone", "Working harder to solve the problem", "Mindfulness or deep breathing"], order: 8 },
      { id: 9, text: "When you make a mistake, you:", options: ["Acknowledge it and apologize quickly", "Analyze why it happened first", "Feel guilty for a long time", "Fix it quietly without drawing attention"], order: 9 },
      { id: 10, text: "Empathy to you means:", options: ["Understanding others' emotions", "Feeling what others feel", "Taking action to help", "Listening without judgment"], order: 10 },
    ],
  },
  {
    title: "Data Science & Analytics Readiness",
    description: "Evaluate your readiness for a data-driven career — from statistics and ML concepts to Python, SQL, and business analytics skills.",
    category: "Data & AI",
    questionCount: 10,
    estimatedMinutes: 18,
    isPremium: true,
    questions: [
      { id: 1, text: "What is the purpose of a confusion matrix?", options: ["To visualize data distributions", "To evaluate classification model performance", "To normalize dataset features", "To display correlation between variables"], order: 1 },
      { id: 2, text: "Which Python library is primarily used for data manipulation?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], order: 2 },
      { id: 3, text: "What does 'overfitting' mean in machine learning?", options: ["The model trains too slowly", "The model performs well on training but poorly on new data", "The model has too few parameters", "The model fails to converge"], order: 3 },
      { id: 4, text: "What is the difference between supervised and unsupervised learning?", options: ["Speed of training", "Presence or absence of labeled training data", "Type of algorithm used", "Size of the dataset"], order: 4 },
      { id: 5, text: "In statistics, what does a p-value < 0.05 typically indicate?", options: ["The result is practically significant", "The null hypothesis is rejected", "The sample size is too small", "The data is normally distributed"], order: 5 },
      { id: 6, text: "Which SQL clause is used to filter grouped results?", options: ["WHERE", "HAVING", "FILTER", "GROUP BY"], order: 6 },
      { id: 7, text: "What is 'feature engineering'?", options: ["Building the model architecture", "Creating or transforming input variables", "Evaluating model accuracy", "Deploying a model to production"], order: 7 },
      { id: 8, text: "Which algorithm is commonly used for recommendation systems?", options: ["Decision Tree", "Collaborative Filtering", "Linear Regression", "K-Means Clustering"], order: 8 },
      { id: 9, text: "What does 'ETL' stand for in data engineering?", options: ["Extract, Transform, Load", "Evaluate, Test, Launch", "Encode, Train, Label", "Export, Transfer, Link"], order: 9 },
      { id: 10, text: "Which metric would you use for an imbalanced classification problem?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-squared"], order: 10 },
    ],
  },
  {
    title: "Entrepreneurship & Business Acumen",
    description: "Test your understanding of startup fundamentals, business strategy, financial concepts, and what it takes to build a successful venture.",
    category: "Business",
    questionCount: 10,
    estimatedMinutes: 12,
    isPremium: false,
    questions: [
      { id: 1, text: "What is a 'minimum viable product' (MVP)?", options: ["A product with all features complete", "The smallest version of a product that validates the core idea", "A prototype with no functionality", "A beta version for internal testing only"], order: 1 },
      { id: 2, text: "What does 'product-market fit' mean?", options: ["Your product is better than competitors", "Your product satisfies a strong market demand", "You have completed market research", "Your product is available in multiple markets"], order: 2 },
      { id: 3, text: "What is 'burn rate' in a startup context?", options: ["The speed of user acquisition", "The rate at which a company spends its capital", "Customer churn percentage", "Revenue growth rate"], order: 3 },
      { id: 4, text: "A company's 'moat' refers to:", options: ["Its office location", "Its competitive advantage that's hard to replicate", "Its founding team's background", "Its patent portfolio"], order: 4 },
      { id: 5, text: "What is 'gross margin'?", options: ["Total revenue minus all expenses", "Revenue minus cost of goods sold, as a percentage of revenue", "Net profit after taxes", "Operating profit before interest"], order: 5 },
      { id: 6, text: "Which funding round typically comes first for a startup?", options: ["Series A", "Series B", "Seed round", "IPO"], order: 6 },
      { id: 7, text: "What does 'B2B' stand for?", options: ["Build to Budget", "Business to Business", "Back to Basics", "Brand to Brand"], order: 7 },
      { id: 8, text: "A 'pivot' in startup terminology means:", options: ["Shutting down the company", "Changing the core business strategy or product direction", "Hiring a new CEO", "Expanding to a new country"], order: 8 },
      { id: 9, text: "What is 'customer lifetime value' (CLV)?", options: ["The age of your oldest customer", "Total revenue expected from a customer over their relationship with you", "The cost to acquire one customer", "Average order value"], order: 9 },
      { id: 10, text: "Which of these is a key component of a business model canvas?", options: ["Employee handbook", "Value proposition", "Office floor plan", "Competitor pricing"], order: 10 },
    ],
  },
];

const challenges = [
  {
    title: "JavaScript Fundamentals Sprint",
    description: "Test your core JavaScript knowledge — closures, promises, prototypes, and ES6+ features. A must for any frontend or fullstack developer.",
    category: "Technology",
    difficulty: "medium",
    timeLimit: 1200,
    questionCount: 8,
    isPremium: false,
    attempts: 142,
    questions: [
      { id: 1, text: "What will `typeof null` return in JavaScript?", options: ["null", "undefined", "object", "boolean"], correctIndex: 2, order: 1 },
      { id: 2, text: "Which of the following creates a closure?", options: ["A function that returns another function", "An arrow function", "A class method", "A try-catch block"], correctIndex: 0, order: 2 },
      { id: 3, text: "What is the output of `[1,2,3].map(x => x * 2)`?", options: ["[1,2,3]", "[2,4,6]", "[1,4,9]", "undefined"], correctIndex: 1, order: 3 },
      { id: 4, text: "What does `Promise.all()` do?", options: ["Runs promises sequentially", "Resolves when all promises resolve (or any rejects)", "Resolves with the fastest promise", "Catches errors from all promises"], correctIndex: 1, order: 4 },
      { id: 5, text: "What is the difference between `==` and `===` in JavaScript?", options: ["No difference", "`===` checks value and type; `==` only checks value", "`==` is faster", "`===` is only for strings"], correctIndex: 1, order: 5 },
      { id: 6, text: "Which method removes the last element from an array?", options: ["shift()", "splice()", "pop()", "slice()"], correctIndex: 2, order: 6 },
      { id: 7, text: "What is 'hoisting' in JavaScript?", options: ["Moving DOM elements up", "Variables/functions being moved to the top of their scope before execution", "A CSS technique", "Memory garbage collection"], correctIndex: 1, order: 7 },
      { id: 8, text: "What does the spread operator `...` do?", options: ["Creates a new function", "Expands an iterable into individual elements", "Declares a rest parameter", "Merges two classes"], correctIndex: 1, order: 8 },
    ],
  },
  {
    title: "Communication & Workplace Excellence",
    description: "Sharpen your professional communication, conflict resolution, and workplace etiquette knowledge with real-world scenarios.",
    category: "Soft Skills",
    difficulty: "easy",
    timeLimit: 900,
    questionCount: 8,
    isPremium: false,
    attempts: 287,
    questions: [
      { id: 1, text: "The best way to handle a disagreement with a colleague is to:", options: ["Complain to your manager immediately", "Address it privately and calmly with them", "Ignore it and hope it resolves itself", "Copy their manager on all future emails"], correctIndex: 1, order: 1 },
      { id: 2, text: "In a professional email, you should:", options: ["Use casual language to seem friendly", "Always CC everyone on the team", "Have a clear subject line and concise content", "Write as long as possible to show effort"], correctIndex: 2, order: 2 },
      { id: 3, text: "Active listening involves:", options: ["Waiting for your turn to speak", "Multitasking during conversations", "Fully focusing and reflecting back what you hear", "Nodding without processing information"], correctIndex: 2, order: 3 },
      { id: 4, text: "When presenting to leadership, you should:", options: ["Cover every detail thoroughly", "Lead with the key insight and support with data", "Use as many slides as possible", "Avoid eye contact to seem humble"], correctIndex: 1, order: 4 },
      { id: 5, text: "Constructive feedback is most effective when it is:", options: ["Vague and general", "Personal and emotional", "Specific, timely, and action-oriented", "Delivered in front of peers"], correctIndex: 2, order: 5 },
      { id: 6, text: "When you miss a deadline, you should:", options: ["Hope no one notices", "Blame external factors", "Proactively communicate and provide a new timeline", "Quietly deliver late without comment"], correctIndex: 2, order: 6 },
      { id: 7, text: "The most important skill in remote work is:", options: ["Working longer hours", "Over-communication and clear documentation", "Being always available on chat", "Avoiding video calls"], correctIndex: 1, order: 7 },
      { id: 8, text: "Networking professionally means:", options: ["Collecting as many business cards as possible", "Building genuine, mutually beneficial relationships", "Only connecting with people senior to you", "Attending every industry event"], correctIndex: 1, order: 8 },
    ],
  },
  {
    title: "Data Structures & Algorithms",
    description: "Crack the coding interview with this challenge on arrays, trees, sorting, and complexity analysis. Essential for software engineering roles.",
    category: "Technology",
    difficulty: "hard",
    timeLimit: 1800,
    questionCount: 8,
    isPremium: true,
    attempts: 94,
    questions: [
      { id: 1, text: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correctIndex: 1, order: 1 },
      { id: 2, text: "Which traversal visits the root node last?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctIndex: 2, order: 2 },
      { id: 3, text: "A hash table has O(1) average lookup. What makes it degrade to O(n)?", options: ["Too many keys", "Hash collisions filling all buckets", "Using string keys", "Large value sizes"], correctIndex: 1, order: 3 },
      { id: 4, text: "Which data structure is best for implementing a breadth-first search?", options: ["Stack", "Queue", "Heap", "Array"], correctIndex: 1, order: 4 },
      { id: 5, text: "What is a 'balanced binary tree'?", options: ["A tree where all nodes have 2 children", "A tree where heights of subtrees differ by at most 1", "A tree with equal left and right nodes", "A tree with no duplicate values"], correctIndex: 1, order: 5 },
      { id: 6, text: "Dynamic programming is best applied when a problem has:", options: ["No known algorithm", "Overlapping subproblems and optimal substructure", "Random inputs", "Parallel processing requirements"], correctIndex: 1, order: 6 },
      { id: 7, text: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, order: 7 },
      { id: 8, text: "In graph theory, what is a 'topological sort' used for?", options: ["Sorting nodes by value", "Ordering nodes in a directed acyclic graph by dependencies", "Finding the shortest path", "Detecting duplicate nodes"], correctIndex: 1, order: 8 },
    ],
  },
  {
    title: "Product Management Fundamentals",
    description: "Test your grasp of PM essentials — user stories, prioritization frameworks, metrics, roadmaps, and product strategy for modern digital products.",
    category: "Business",
    difficulty: "medium",
    timeLimit: 1200,
    questionCount: 8,
    isPremium: false,
    attempts: 201,
    questions: [
      { id: 1, text: "A user story follows the format:", options: ["As a [role], I want [feature] so that [benefit]", "Feature: [name], Priority: [level]", "When [trigger], then [action]", "Given [context], When [action], Then [result]"], correctIndex: 0, order: 1 },
      { id: 2, text: "The RICE prioritization framework stands for:", options: ["Revenue, Impact, Cost, Effort", "Reach, Impact, Confidence, Effort", "Risk, Innovation, Cost, Evaluation", "Result, Insight, Conversion, Engagement"], correctIndex: 1, order: 2 },
      { id: 3, text: "What is a 'North Star Metric'?", options: ["The metric that matters most for long-term growth", "Monthly active users", "Revenue per quarter", "Customer satisfaction score"], correctIndex: 0, order: 3 },
      { id: 4, text: "In product discovery, the goal is to:", options: ["Ship features as fast as possible", "Validate that you're solving the right problem before building", "Complete the product roadmap", "Gather stakeholder requirements"], correctIndex: 1, order: 4 },
      { id: 5, text: "What does 'DAU/MAU ratio' measure?", options: ["Daily revenue vs monthly revenue", "User stickiness / engagement frequency", "New vs returning users", "App store ratings over time"], correctIndex: 1, order: 5 },
      { id: 6, text: "A product roadmap is best used to:", options: ["Commit to exact feature delivery dates", "Communicate direction and priorities over time", "Replace the product backlog", "Satisfy investor requirements"], correctIndex: 1, order: 6 },
      { id: 7, text: "Which technique is best for understanding user pain points?", options: ["Analytics dashboards", "A/B testing", "User interviews and contextual inquiry", "Net Promoter Score surveys"], correctIndex: 2, order: 7 },
      { id: 8, text: "What is 'technical debt'?", options: ["Money owed to software vendors", "Shortcuts taken in code that will cost more time later", "Unresolved bugs in production", "Server infrastructure costs"], correctIndex: 1, order: 8 },
    ],
  },
  {
    title: "Design Thinking & UX Principles",
    description: "Explore user-centred design, usability heuristics, prototyping, and UX research methods that create exceptional product experiences.",
    category: "Design",
    difficulty: "medium",
    timeLimit: 1200,
    questionCount: 8,
    isPremium: false,
    attempts: 178,
    questions: [
      { id: 1, text: "The first phase of Design Thinking is:", options: ["Ideate", "Prototype", "Empathize", "Define"], correctIndex: 2, order: 1 },
      { id: 2, text: "Nielsen's first usability heuristic is:", options: ["Error Prevention", "Visibility of System Status", "Consistency and Standards", "User Control and Freedom"], correctIndex: 1, order: 2 },
      { id: 3, text: "A 'wireframe' is best described as:", options: ["A high-fidelity visual mockup", "A low-fidelity structural sketch of a UI", "A coded prototype", "A user journey map"], correctIndex: 1, order: 3 },
      { id: 4, text: "What does 'information architecture' refer to?", options: ["Server and database structure", "How content is organized and navigated in a product", "The visual hierarchy of a design", "Backend API design"], correctIndex: 1, order: 4 },
      { id: 5, text: "In UX research, a 'persona' is:", options: ["A real user you've interviewed", "A fictional character representing a user segment", "A customer support profile", "An analytics segment"], correctIndex: 1, order: 5 },
      { id: 6, text: "What is the 'Gestalt principle of proximity'?", options: ["Elements that are similar look related", "Elements close together are perceived as grouped", "The figure stands out from the background", "Humans prefer symmetry and balance"], correctIndex: 1, order: 6 },
      { id: 7, text: "A/B testing in UX is used to:", options: ["Debug code errors", "Compare two design versions to see which performs better", "Test accessibility compliance", "Validate database queries"], correctIndex: 1, order: 7 },
      { id: 8, text: "What does WCAG stand for?", options: ["Web Content Accessibility Guidelines", "Website Code and Graphics", "Web Component Application Guide", "World Content and Graphics"], correctIndex: 0, order: 8 },
    ],
  },
  {
    title: "Financial Literacy for Professionals",
    description: "Build your understanding of personal finance, investing, tax basics, and corporate finance concepts essential for career and life success.",
    category: "Finance",
    difficulty: "easy",
    timeLimit: 900,
    questionCount: 8,
    isPremium: true,
    attempts: 312,
    questions: [
      { id: 1, text: "What is 'compound interest'?", options: ["Interest calculated only on the principal", "Interest calculated on principal plus accumulated interest", "A fixed monthly fee on loans", "Government tax on savings"], correctIndex: 1, order: 1 },
      { id: 2, text: "What does 'diversification' in investing mean?", options: ["Investing all money in one stock", "Spreading investments across different assets to reduce risk", "Changing your portfolio daily", "Only investing in index funds"], correctIndex: 1, order: 2 },
      { id: 3, text: "What is a 'balance sheet'?", options: ["A monthly bank statement", "A snapshot of assets, liabilities, and equity at a point in time", "A profit and loss report", "A cash flow statement"], correctIndex: 1, order: 3 },
      { id: 4, text: "What is 'inflation'?", options: ["Rising interest rates", "The general rise in prices over time reducing purchasing power", "Stock market growth", "Government money printing"], correctIndex: 1, order: 4 },
      { id: 5, text: "What does 'P/E ratio' measure in stocks?", options: ["Profit vs expenses", "Price vs earnings per share", "Portfolio vs equity", "Performance vs expectation"], correctIndex: 1, order: 5 },
      { id: 6, text: "An 'emergency fund' should cover:", options: ["1 week of expenses", "3–6 months of living expenses", "One year of salary", "Only rent and utilities"], correctIndex: 1, order: 6 },
      { id: 7, text: "What is 'gross income'?", options: ["Income after all deductions and taxes", "Total income before any deductions", "Business revenue minus expenses", "Take-home pay"], correctIndex: 1, order: 7 },
      { id: 8, text: "Dollar-cost averaging is a strategy where you:", options: ["Buy stocks when they're at their lowest", "Invest a fixed amount at regular intervals regardless of price", "Sell assets when prices peak", "Only invest in US dollar assets"], correctIndex: 1, order: 8 },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    // Check if already seeded
    const existing = await client.query("SELECT COUNT(*) FROM assessments");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Already have ${existing.rows[0].count} assessments — skipping seed.`);
      await client.release();
      await pool.end();
      return;
    }

    console.log("Seeding assessments...");
    for (const a of assessments) {
      await client.query(
        `INSERT INTO assessments (title, description, category, question_count, estimated_minutes, is_premium, questions)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [a.title, a.description, a.category, a.questionCount, a.estimatedMinutes, a.isPremium, JSON.stringify(a.questions)]
      );
    }
    console.log(`✓ Inserted ${assessments.length} assessments`);

    console.log("Seeding challenges...");
    for (const c of challenges) {
      await client.query(
        `INSERT INTO challenges (title, description, category, difficulty, time_limit, question_count, is_premium, questions, attempts)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [c.title, c.description, c.category, c.difficulty, c.timeLimit, c.questionCount, c.isPremium, JSON.stringify(c.questions), c.attempts]
      );
    }
    console.log(`✓ Inserted ${challenges.length} challenges`);

    console.log("✅ Seed complete!");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
