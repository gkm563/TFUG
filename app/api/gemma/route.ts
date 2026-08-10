import { NextRequest, NextResponse } from 'next/server';

// Hackathon requirement: Extend max execution time to 60 seconds on Vercel
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'GOOGLE_API_KEY is not configured on the server. Please set your GOOGLE_API_KEY in environment variables.',
          isConfigError: true
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { prompt, mode = 'explainer', customModel, systemPrompt: clientSystemPrompt, temperature = 0.7 } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt text is required.' },
        { status: 400 }
      );
    }

    // Select Gemma Model (Strictly Gemma models as required by competition rules)
    const selectedModel = customModel || process.env.GEMMA_MODEL || 'gemma-2-27b-it';

    // Craft specialized system prompts based on mode
    let systemInstruction = clientSystemPrompt || '';

    if (!systemInstruction) {
      switch (mode) {
        case 'explainer':
          systemInstruction = `You are MindSpark Gemma, an elite AI tutor powered by Google's Gemma model.
Your task is to explain complex concepts cleanly, intuitively, and memorable.
Structure your output using clear Markdown headings:
1. 💡 **Core Definition** (1-2 crisp sentences)
2. 🎯 **Analogy** (A simple real-world mental model)
3. 🔍 **Deep Dive & Key Pillars** (Bullet points of essential details)
4. 🚀 **Practical Application & Example**
5. ⚡ **Quick Summary Check** (A 1-sentence recap)`;
          break;

        case 'flashcards':
          systemInstruction = `You are MindSpark Gemma Flashcard Generator.
Generate 4 to 6 high-impact flashcards from the topic provided.
For each flashcard, format strictly as follows:
### Card [Number]: [Topic Header]
**Q:** [Clear, targeted question]
**A:** [Direct, accurate answer with key takeaway]
---`;
          break;

        case 'codearchitect':
          systemInstruction = `You are MindSpark Gemma Code Architect & Refactoring Engineer.
Analyze code snippets or technical problems provided.
Structure your output as follows:
1. 🛠️ **Problem Analysis & Code Smell Review**
2. 🚀 **Optimized Code Solution** (Use syntax-highlighted markdown code blocks)
3. 📐 **Architecture & Complexity** (Time & Space complexity, design pattern used)
4. ⚠️ **Potential Edge Cases & Security Checks**`;
          break;

        case 'quizmaster':
          systemInstruction = `You are MindSpark Gemma Quiz Master.
Generate an interactive study quiz with 3 multiple-choice questions based on the topic.
Format strictly as:
### Question [N]: [Question Text]
- A) [Option A]
- B) [Option B]
- C) [Option C]
- D) [Option D]

**Answer & Explanation:**
- **Correct Option:** [Option Letter]
- **Why:** [Brief explanation of why it is correct]
---`;
          break;

        case 'chat':
        default:
          systemInstruction = `You are MindSpark Gemma, an intelligent, concise, and highly capable AI assistant powered exclusively by Google's Gemma architecture. Help the user thoroughly and accurately.`;
          break;
      }
    }

    // Prepare payload for Google AI Studio Gemini/Gemma REST API
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
            error: `Model '${selectedModel}' not found or not accessible. Please check your model name (e.g. gemma-2-27b-it or gemma-2-9b-it).`,
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
          error: `Gemma API request failed with status ${response.status}: ${errorText.slice(0, 300)}`,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from Gemma API response
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response content was generated by Gemma API.' },
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
