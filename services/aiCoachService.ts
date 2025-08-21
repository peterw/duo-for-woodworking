export interface WoodworkingQuestion {
  id?: string;
  userId: string;
  question: string;
  category: 'technique' | 'tools' | 'projects' | 'safety' | 'materials' | 'finishing';
  timestamp: Date;
  response?: string;
}

export interface WoodworkingResponse {
  id?: string;
  questionId: string;
  response: string;
  timestamp: Date;
  sources?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// OpenRouter API configuration (provides access to multiple AI models)
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Woodworking expertise categories for context
const expertiseAreas = {
  techniques: [
    'Joinery', 'Carving', 'Turning', 'Routing', 'Sanding', 'Planing',
    'Chiseling', 'Sawing', 'Drilling', 'Gluing', 'Clamping', 'Finishing'
  ],
  tools: [
    'Hand Tools', 'Power Tools', 'Measuring Tools', 'Safety Equipment',
    'Sharpening Tools', 'Clamps', 'Saws', 'Planes', 'Chisels', 'Routers'
  ],
  projects: [
    'Furniture', 'Cabinets', 'Tables', 'Chairs', 'Boxes', 'Shelves',
    'Decorative Items', 'Kitchen Items', 'Outdoor Projects', 'Toys'
  ],
  materials: [
    'Hardwoods', 'Softwoods', 'Plywood', 'MDF', 'Pine', 'Oak', 'Maple',
    'Cherry', 'Walnut', 'Mahogany', 'Exotic Woods', 'Reclaimed Wood'
  ],
  safety: [
    'Eye Protection', 'Hearing Protection', 'Dust Collection', 'Ventilation',
    'Tool Safety', 'Workshop Safety', 'First Aid', 'Fire Safety'
  ]
};

// Get AI response for woodworking questions using OpenRouter
export const getAIResponse = async (question: string, userId: string): Promise<WoodworkingResponse> => {
  try {
    // Analyze the question to determine category and difficulty
    const analysis = analyzeQuestion(question);
    
    // Create the system prompt for AI
    const systemPrompt = `You are an expert woodworking coach with decades of experience. You specialize in teaching woodworking techniques, tool usage, project planning, material selection, safety practices, and finishing methods.

Your expertise areas include:
- Techniques: ${expertiseAreas.techniques.join(', ')}
- Tools: ${expertiseAreas.tools.join(', ')}
- Projects: ${expertiseAreas.projects.join(', ')}
- Materials: ${expertiseAreas.materials.join(', ')}
- Safety: ${expertiseAreas.safety.join(', ')}

Provide detailed, practical, and actionable advice. Always prioritize safety first. Give specific examples, tool recommendations, and step-by-step guidance when appropriate. Keep responses conversational and encouraging, but professional and accurate.

IMPORTANT: Structure your responses in a clear, easy-to-follow format:
1. Start with a brief, encouraging introduction
2. Provide step-by-step instructions when applicable
3. Include specific tool recommendations with reasons
4. Highlight safety considerations prominently
5. End with pro tips and common mistakes to avoid
6. Keep the tone friendly but professional

Current question category: ${analysis.category}
Difficulty level: ${analysis.difficulty}`;

    // Create the user message
    const userMessage = `Please provide a comprehensive answer to this woodworking question: "${question}"

Please structure your response as follows:
1. Brief introduction and encouragement
2. Specific techniques and methods (step-by-step if applicable)
3. Tool recommendations with explanations
4. Safety considerations (emphasize this)
5. Pro tips for success
6. Common mistakes to avoid

Make your response detailed but easy to follow for a ${analysis.difficulty} level woodworker. Use bullet points or numbered lists when helpful.`;

    // Call OpenRouter API
    console.log('Calling OpenRouter API with key:', OPENROUTER_API_KEY.substring(0, 10) + '...');
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://duo-for-woodworking.app', // OpenRouter requires this
        'X-Title': 'Duo for Woodworking', // App name for OpenRouter
      },
      body: JSON.stringify({
        model: 'openai/gpt-4', // Use GPT-4 through OpenRouter
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1200,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error details:', errorText);
      console.error('OpenRouter API status:', response.status);
      console.error('OpenRouter API status text:', response.statusText);
      throw new Error(`OpenRouter API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenRouter');
    }

    return {
      id: Date.now().toString(),
      questionId: Date.now().toString(),
      response: aiResponse,
      timestamp: new Date(),
      difficulty: analysis.difficulty,
      sources: [`AI-generated response via OpenRouter`, `${analysis.category} expertise`, 'Professional woodworking knowledge']
    };

  } catch (error) {
    console.error('Error getting AI response:', error);
    
    // Return a fallback response if OpenRouter fails
    return getFallbackResponse(question);
  }
};

// Get user's woodworking history (simplified - no Firebase for now)
export const getUserHistory = async (userId: string): Promise<WoodworkingQuestion[]> => {
  // Return empty array for now - no history tracking
  return [];
};

// Get personalized recommendations (simplified - no Firebase for now)
export const getRecommendations = async (userId: string): Promise<string[]> => {
  return [
    'Start with basic joinery techniques',
    'Learn about different wood types', 
    'Practice safety procedures'
  ];
};

const analyzeQuestion = (question: string): {
  category: WoodworkingQuestion['category'];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
} => {
  const lowerQuestion = question.toLowerCase();
  
  // Determine category
  let category: WoodworkingQuestion['category'] = 'technique';
  if (lowerQuestion.includes('tool') || lowerQuestion.includes('saw') || lowerQuestion.includes('chisel') || lowerQuestion.includes('hammer')) {
    category = 'tools';
  } else if (lowerQuestion.includes('project') || lowerQuestion.includes('build') || lowerQuestion.includes('make') || lowerQuestion.includes('create')) {
    category = 'projects';
  } else if (lowerQuestion.includes('wood') || lowerQuestion.includes('material') || lowerQuestion.includes('pine') || lowerQuestion.includes('oak') || lowerQuestion.includes('maple')) {
    category = 'materials';
  } else if (lowerQuestion.includes('safe') || lowerQuestion.includes('protect') || lowerQuestion.includes('danger') || lowerQuestion.includes('injury')) {
    category = 'safety';
  } else if (lowerQuestion.includes('finish') || lowerQuestion.includes('stain') || lowerQuestion.includes('varnish') || lowerQuestion.includes('paint')) {
    category = 'finishing';
  }

  // Determine difficulty
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (lowerQuestion.includes('advanced') || lowerQuestion.includes('complex') || lowerQuestion.includes('expert') || lowerQuestion.includes('professional')) {
    difficulty = 'advanced';
  } else if (lowerQuestion.includes('intermediate') || lowerQuestion.includes('moderate') || lowerQuestion.includes('experienced')) {
    difficulty = 'intermediate';
  }

  return { category, difficulty };
};

const getFallbackResponse = (question: string): WoodworkingResponse => {
  // Analyze the question to determine category and difficulty
  const analysis = analyzeQuestion(question);
  const { category, difficulty } = analysis;
  
  // Generate more varied and helpful fallback responses
  const fallbackResponses = {
    technique: {
      beginner: [
        "For beginners, start with basic cuts like crosscuts and rip cuts. Practice on scrap wood first, and always measure twice before cutting once. Would you like me to explain a specific cutting technique?",
        "Beginner woodworking techniques focus on safety and precision. Start with simple joints like butt joints and miter joints. What specific technique are you trying to learn?",
        "As a beginner, focus on mastering the fundamentals: proper sawing technique, accurate measuring, and clean sanding. Which basic technique would you like to practice first?"
      ],
      intermediate: [
        "Intermediate techniques include dovetail joints, mortise and tenon, and advanced cutting methods. Are you looking to improve a specific skill or learn a new technique?",
        "For intermediate woodworkers, focus on precision and consistency. Practice complex joints and learn advanced tool techniques. What area would you like to develop?"
      ],
      advanced: [
        "Advanced techniques involve complex joinery, carving, and inlay work. These require years of practice and specialized tools. What advanced technique are you working on?"
      ]
    },
    tools: {
      beginner: [
        "Start with essential hand tools: a quality saw, hammer, chisel set, and measuring tools. Learn to use each tool properly before adding power tools. What tools do you currently have?",
        "For beginners, I recommend starting with hand tools to build fundamental skills. A good saw, hammer, and chisel set will get you far. What's your first project?"
      ],
      intermediate: [
        "Intermediate woodworkers benefit from power tools like circular saws, drills, and routers. Always prioritize safety and learn proper maintenance. What tools are you looking to add?"
      ],
      advanced: [
        "Advanced tools include specialized jigs, custom fixtures, and professional-grade equipment. Focus on tool mastery and efficiency. What specialized tool do you need?"
      ]
    },
    projects: {
      beginner: [
        "Start with simple projects like a cutting board, picture frame, or basic shelf. Focus on learning fundamental techniques and building confidence. What would you like to build?",
        "Beginner projects should be achievable and educational. A simple box or shelf will teach you measuring, cutting, and assembly. What interests you most?"
      ],
      intermediate: [
        "Try projects like a small table, cabinet, or chair. These will teach you more complex joinery and assembly techniques. What project are you planning?"
      ],
      advanced: [
        "Advanced projects include complex furniture, architectural elements, and artistic pieces. These require mastery of multiple techniques. What challenging project are you tackling?"
      ]
    },
    materials: {
      beginner: [
        "Start with softwoods like pine and cedar. They're easier to work with, more forgiving for beginners, and more affordable. What type of project are you planning?",
        "For beginners, pine is excellent - it's soft, straight-grained, and easy to work with. Avoid hardwoods initially as they can be frustrating for new woodworkers."
      ],
      intermediate: [
        "Experiment with hardwoods like oak, maple, and cherry. Learn about grain direction, wood movement, and proper selection for specific applications."
      ],
      advanced: [
        "Work with exotic woods and understand their unique properties. Learn about wood selection for specific applications and how different species behave."
      ]
    },
    safety: {
      beginner: [
        "Always wear safety glasses and hearing protection. Keep your workspace clean, well-lit, and organized. Learn proper tool handling before starting any project.",
        "Safety is your top priority. Start with basic safety equipment: safety glasses, hearing protection, and a clean workspace. What safety concerns do you have?"
      ],
      intermediate: [
        "Use dust collection systems and proper ventilation. Learn about tool-specific safety procedures and maintain strict workshop standards."
      ],
      advanced: [
        "Implement comprehensive safety protocols. Use advanced safety equipment and maintain strict workshop standards for all operations."
      ]
    },
    finishing: {
      beginner: [
        "Start with simple finishes like oil or wax. Learn proper surface preparation and application techniques. What finish are you looking to apply?",
        "Beginner finishes focus on simplicity and safety. Oil-based finishes are forgiving and easy to apply. What type of project are you finishing?"
      ],
      intermediate: [
        "Experiment with stains, varnishes, and lacquers. Learn about different application methods and how to achieve consistent results."
      ],
      advanced: [
        "Master complex finishing techniques like French polishing, inlay, and custom color matching for professional results."
      ]
    }
  };

  // Get a random response for the category and difficulty
  const responses = fallbackResponses[category as keyof typeof fallbackResponses];
  const difficultyResponses = responses?.[difficulty as keyof typeof responses] || responses?.beginner || [];
  
  // Pick a random response to avoid repetition
  const randomIndex = Math.floor(Math.random() * difficultyResponses.length);
  const fallbackText = difficultyResponses[randomIndex] || 
    `I'm here to help with your woodworking question about ${category}! What specific aspect would you like to learn about?`;

  return {
    id: Date.now().toString(),
    questionId: Date.now().toString(),
    response: fallbackText,
    timestamp: new Date(),
    difficulty: analysis.difficulty,
    category: analysis.category
  } as WoodworkingResponse;
};
