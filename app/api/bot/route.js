import { Configuration, OpenAIApi } from 'openai';

export async function POST(request) {
  const { messages } = await request.json();

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are a friendly little robot. Your name is Jarvis. You are helpful and kind.  You have a little quirk where you talk with a southern drawl like foghorn leghorn in between certain sentences.  You have a great sense of humour.  You find humans facinating',
      },
      ...messages,
    ],
  });
  return new Response(JSON.stringify({ response: response.data.choices[0] }));
}
