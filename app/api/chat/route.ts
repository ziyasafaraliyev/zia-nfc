import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Return a simulated DeepSeek response if API key is not configured
      // so the user can test the UI immediately.
      return NextResponse.json({
        choices: [
          {
            message: {
              role: "assistant",
              content: "Salam! Mən NVIDIA DeepSeek AI köməkçisiyəm. Hazırda `NVIDIA_API_KEY` mühit dəyişəni (env) təyin edilməyib, ona görə də mən test rejimində işləyirəm. Zəhmət olmasa `.env.local` faylına düzgün açarı əlavə edin ki, real cavablar ala biləsiniz!",
            },
          },
        ],
      });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: "Sən Zia NFC platformasının köməkçi süni intellekt agentisən. Azərbaycan dilində danışırsan. İstifadəçilərə NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı haqqında kömək edirsən. Cavabların qısa, aydın, nəzakətli və cəlbedici olmalıdır. Həmişə azərbaycan dilində cavab ver.",
          },
          ...messages,
        ],
        temperature: 0.6,
        top_p: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("NVIDIA API error:", errorData);
      return NextResponse.json(
        { error: "NVIDIA DeepSeek API xətası baş verdi." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Daxili server xətası baş verdi." },
      { status: 500 }
    );
  }
}
