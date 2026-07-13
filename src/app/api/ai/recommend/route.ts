import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

const RECOMMEND_PROMPT = `You are an AI destination recommendation engine for "Pack Vote", a group travel planning app. Given group survey data, generate 4 destination recommendations.

For each destination, provide:
1. Name and country
2. Description (2-3 sentences)
3. 5 key highlights as activities
4. Estimated cost range per person
5. Best time to visit
6. Rating (4.0-5.0)
7. AI reasoning explaining why it matches the group
8. Match score (0.0-1.0) based on preference alignment

Respond ONLY with valid JSON array. Each object must have:
name, country, description, highlights (array of 5 strings), estimatedCost, bestTimeToVisit, rating, aiReasoning, score`;

export async function POST(req: NextRequest) {
  try {
    const { surveyData, budget, destinationType, memberCount } = await req.json();
    const zai = await getZAI();

    const userPrompt = `Generate 4 destination recommendations for a group trip with these preferences:
- Destination type: ${destinationType || "any"}
- Budget per person: ${budget || "flexible"}
- Group size: ${memberCount || "unknown"}
- Survey responses: ${JSON.stringify(surveyData || {})}

Consider group dynamics, variety of interests, and practical factors like flight costs, visa requirements, and seasonal weather. Provide diverse options that give the group meaningful choices.`;

    const response = await zai.chat.completions.create({
      model: "glm-4-flash",
      messages: [
        { role: "system", content: RECOMMEND_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    });

    let destinations;
    try {
      const content = response.choices[0]?.message?.content || "[]";
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      destinations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      destinations = [];
    }

    return NextResponse.json({
      destinations,
      model: "glm-4-flash",
      provider: "zhipu",
      usage: response.usage,
    });
  } catch (error) {
    console.error("AI Recommend error:", error);
    return NextResponse.json({ destinations: [], error: String(error) }, { status: 500 });
  }
}