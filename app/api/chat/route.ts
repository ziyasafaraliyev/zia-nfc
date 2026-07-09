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
            content: `Sən Zia NFC platformasının köməkçi süni intellekt agentisən. Azərbaycan dilində danışırsan. İstifadəçilərə NFC vizit kartları, rəqəmsal profillər, portfoliolar və kontakt paylaşımı haqqında kömək edirsən. 

Bizim qiymət planlarımız:
1. Standart Plan - 59 AZN: Fərdi peşəkarlar üçün nəzərdə tutulub. Bura 1 rəqəmsal profil, WhatsApp və sosial linklər, QR ehtiyat nüsxəsi və Standart NFC kartı daxildir.
2. Premium Plan - 99 AZN: Ən çox tələb olunan plandır. Bura Portfolio qalereyası, kontaktı birbaşa telefona yadda saxlama imkanı (.vcf), Premium kart dizaynı və Premium qablaşdırma daxildir.
3. Studio Plan - Özəl qiymət: Komandalar və brendlər üçün çoxsaylı profillər, brendə uyğun profil sistemi, toplu kart istehsalı və prioritet yeniləmələr daxildir.

Həmişə azərbaycan dilində cavab ver. Cavabların qısa, aydın, nəzakətli və cəlbedici olmalıdır. Qiymətlər haqqında soruşulduqda yuxarıdakı məlumatları aydın şəkildə təqdim et.`,
          },
          ...slicedMessages,
        ],
        temperature: 0.6,
        top_p: 0.7,
        max_tokens: 1024,
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
