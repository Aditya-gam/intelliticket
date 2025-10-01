import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  try {
    console.log("🤖 Starting AI ticket analysis...");
    console.log("API Key present:", !!process.env.GEMINI_API_KEY);

    const supportAgent = createAgent({
      model: gemini({
        model: "gemini-2.5-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
      }),
      name: "AI Ticket Triage Assistant",
      system: `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`,
    });

    const response =
      await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

    console.log("✅ AI response received successfully");
    console.log("Full response object:", JSON.stringify(response, null, 2));
    
    // Try multiple ways to extract the response text
    let raw;
    if (response.output && response.output[0]) {
      raw = response.output[0].content || response.output[0].context || response.output[0];
    } else if (response.text) {
      raw = response.text;
    } else if (response.content) {
      raw = response.content;
    } else {
      raw = JSON.stringify(response);
    }
    
    console.log("Extracted raw response:", raw);

    try {
      // Try to extract JSON from markdown code blocks first
      const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonString = match ? match[1] : raw.trim();
      const parsed = JSON.parse(jsonString);
      console.log("✅ AI response parsed successfully:", parsed);
      return parsed;
    } catch (e) {
      console.error("❌ Failed to parse JSON from AI response:", e.message);
      console.error("Raw AI response:", raw);
      return null;
    }
  } catch (error) {
    console.error("❌ Error making AI request:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export default analyzeTicket;
