import { NextRequest, NextResponse } from 'next/server';

// Hackathon requirement: Extend max execution time to 60 seconds on Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const body = await req.json();
    const { prompt, mode = 'explainer', customModel, systemPrompt: clientSystemPrompt, temperature = 0.7 } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt text is required.' },
        { status: 400 }
      );
    }

    const selectedModel = customModel || process.env.GEMMA_MODEL || 'gemma-2-27b-it';

    // Craft specialized system prompts based on mode
    let systemInstruction = clientSystemPrompt || '';

    if (!systemInstruction) {
      switch (mode) {
        case 'explainer':
          systemInstruction = `You are MindSpark Gemma, an elite AI tutor powered by Google's Gemma model.
Structure your output using clear Markdown headings:
1. 💡 **Core Definition** (1-2 crisp sentences)
2. 🎯 **Analogy** (A simple real-world mental model)
3. 🔍 **Deep Dive & Key Pillars** (Bullet points of essential details)
4. 🚀 **Practical Application & Example**
5. ⚡ **Quick Summary Check** (A 1-sentence recap)`;
          break;

        case 'flashcards':
          systemInstruction = `You are MindSpark Gemma Flashcard Generator.
Generate 4 high-impact flashcards strictly as:
### Card [Number]: [Topic Header]
**Q:** [Clear, targeted question]
**A:** [Direct, accurate answer with key takeaway]
---`;
          break;

        case 'codearchitect':
          systemInstruction = `You are MindSpark Gemma Code Architect & Refactoring Engineer.
Structure your output as:
1. 🛠️ **Problem Analysis & Code Smell Review**
2. 🚀 **Optimized Code Solution** (Use syntax-highlighted code blocks)
3. 📐 **Architecture & Complexity** (Time & Space complexity)
4. ⚠️ **Potential Edge Cases & Security Checks**`;
          break;

        case 'quizmaster':
          systemInstruction = `You are MindSpark Gemma Quiz Master.
Generate 3 multiple-choice questions strictly formatted as:
### Question [N]: [Question Text]
- A) [Option A]
- B) [Option B]
- C) [Option C]
- D) [Option D]

**Answer & Explanation:**
- **Correct Option:** [Option Letter]
- **Why:** [Brief explanation]
---`;
          break;

        case 'chat':
        default:
          systemInstruction = `You are MindSpark Gemma, an intelligent AI assistant powered exclusively by Google's Gemma architecture.`;
          break;
      }
    }

    // IF SERVER IS MISSING API KEY: Provide high-quality Gemma intelligent response fallback
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_API_KEY')) {
      console.warn('GOOGLE_API_KEY not configured on server. Providing high-quality fail-safe response.');
      
      let fallbackText = '';
      if (mode === 'flashcards') {
        fallbackText = `### Card 1: Core Fundamentals of ${prompt}
**Q:** What is the primary operational objective of ${prompt}?
**A:** The main goal of ${prompt} is to optimize processing efficiency, streamline data flow, and ensure robust architectural separation of concerns.
---
### Card 2: Architectural Principles of ${prompt}
**Q:** How does ${prompt} handle modular scaling under load?
**A:** It decouples state management from computational execution, allowing horizontal scaling and predictable latency bounds.
---
### Card 3: Real-World Applications of ${prompt}
**Q:** Where is ${prompt} most effectively deployed in production systems?
**A:** In high-throughput distributed architectures, AI inference pipelines, and fault-tolerant cloud microservices.
---
### Card 4: Key Trade-offs & Security
**Q:** What key security or performance trade-off must engineers consider for ${prompt}?
**A:** Memory footprint management vs computational speed; implementing strict parameter validation prevents unauthorized side-effects.
---`;
      } else if (mode === 'codearchitect') {
        fallbackText = `1. 🛠️ **Problem Analysis & Code Review**
Analyzing query regarding \`${prompt}\`. Key focus areas include memory optimization, thread safety, and clean separation of concerns.

2. 🚀 **Optimized Code Solution**
\`\`\`typescript
// Production-grade implementation of ${prompt}
export async function executeGemmaWorkflow<T>(input: T): Promise<{ success: boolean; data: T }> {
  try {
    // Validate structural boundaries
    if (!input) throw new Error("Invalid input payload");
    
    // Execute core logic asynchronously
    const processed = await Promise.resolve(input);
    
    return {
      success: true,
      data: processed,
    };
  } catch (error) {
    console.error("Execution error:", error);
    throw error;
  }
}
\`\`\`

3. 📐 **Architecture & Complexity**
- **Time Complexity:** $\\mathcal{O}(1)$ optimal lookup path.
- **Space Complexity:** $\\mathcal{O}(n)$ linear allocation bound.

4. ⚠️ **Potential Edge Cases**
- Verify null/undefined guards before dereferencing payload properties.
- Ensure proper cancellation token propagation for long-running network requests.`;
      } else if (mode === 'quizmaster') {
        fallbackText = `### Question 1: What is the primary purpose of ${prompt}?
- A) To reduce memory allocation overhead
- B) To provide structured reasoning and execution models
- C) To manage static file storage
- D) To bypass security validation

**Answer & Explanation:**
- **Correct Option:** B
- **Why:** ${prompt} provides structured logic execution and high-accuracy evaluation patterns.
---
### Question 2: Which design pattern is most commonly associated with ${prompt}?
- A) Singleton Pattern
- B) Factory & Adapter Patterns
- C) Anti-pattern Monolith
- D) Circular Dependency

**Answer & Explanation:**
- **Correct Option:** B
- **Why:** Factory and Adapter patterns allow seamless decoupling of internal components.
---`;
      } else {
        fallbackText = `1. 💡 **Core Definition**
**${prompt}** represents a fundamental engineering concept focused on structured reasoning, efficient data transformation, and reliable system architecture.

2. 🎯 **Analogy**
Imagine a well-organized logistics distribution hub: instead of raw packages being piled randomly, **${prompt}** acts as an automated sorting matrix that routes every incoming request to its precise destination with minimal friction.

3. 🔍 **Deep Dive & Key Pillars**
- ⚡ **Performance & Scalability**: Optimized for low latency and high execution throughput.
- 🛡️ **Reliability & Safety**: Implements strict isolation boundaries to prevent unexpected side effects.
- 🧩 **Modularity**: Designed to integrate seamlessly with existing software pipelines.

4. 🚀 **Practical Application**
Used extensively across modern cloud platforms, machine learning pipelines, and distributed web applications to ensure robust user experiences.

5. ⚡ **Quick Summary Check**
**${prompt}** delivers predictable, scalable, and intuitive execution tailored for real-world applications.`;
      }

      return NextResponse.json({
        result: fallbackText,
        modelUsed: `${selectedModel} (Demo Fallback Mode - Set GOOGLE_API_KEY for live AI)`,
        timestamp: new Date().toISOString(),
      });
    }

    // Prepare payload for Google AI Studio REST API
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\nUser Request: ${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: Number(temperature),
        maxOutputTokens: 2048,
        topP: 0.95,
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemma API Error Response:', response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: `Model '${selectedModel}' not found. Check model name in AI Studio (e.g. gemma-2-27b-it).`,
            status: 404
          },
          { status: 404 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Gemma API Quota Limit Exceeded (429). Please wait a moment before trying again.',
            status: 429
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Gemma API request failed (${response.status}): ${errorText.slice(0, 300)}`,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response content generated by Gemma API.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: generatedText,
      modelUsed: selectedModel,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Server error in /api/gemma:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
