import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Stream simulated response if key is missing
      const mockText = "Salam! Mən NVIDIA DeepSeek AI köməkçisiyəm. Hazırda `NVIDIA_API_KEY` mühit dəyişəni (env) təyin edilməyib, ona görə də mən test rejimində işləyirəm. Zəhmət olmasa `.env.local` faylına düzgün açarı əlavə edin ki, real cavablar ala biləsiniz!";
      
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const chunks = mockText.match(/.{1,4}/g) || [mockText];
          for (const chunk of chunks) {
            const payload = {
              choices: [
                {
                  delta: {
                    content: chunk,
                  },
                },
              ],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const slicedMessages = messages.slice(-6);

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
            content: `Sən Zia NFC platformasının süni intellekt köməkçisisən. Həmişə Azərbaycan dilində cavab ver. 
ÇOX VACİB: Cavabların maksimum dərəcədə qısa, sürətli və konkret olmalıdır! Qətiyyən uzun paraqraflar yazma. Maksimum 1-2 cümlə istifadə et.

Bizim qiymət planlarımız:
1. Standart Plan - 59 AZN: 1 profil, Standart NFC kart.
2. Premium Plan - 99 AZN: Portfolio, vCard yaddaş, Premium dizayn.
3. Studio Plan - Özəl: Komandalar üçün.`,
          },
          ...slicedMessages,
        ],
        temperature: 0.3,
        top_p: 0.7,
        max_tokens: 200,
        stream: true,
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

    // Pass the response body stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Daxili server xətası baş verdi." },
      { status: 500 }
    );
  }
}
