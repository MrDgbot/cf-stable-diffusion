import { Ai } from './vendor/@cloudflare/ai.js';

export default {
    async fetch(request, env) {
        const reqBody = await request.json();

        if (!reqBody.prompt) {
            return new Response(
                JSON.stringify({
                    error: {
                        message: 'prompt is required',
                        type: 'api_error',
                        param: '',
                        code: 'prompt_missing'
                    }
                }),
                {
                    status: 400,
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            );
        }

        const prompt = reqBody.prompt;
        const n = reqBody.n || 1;
        const size = reqBody.size || '1024x1024';

        const ai = new Ai(env.AI);

        const inputs = {
            prompt: prompt
        };

        const buffer = await retryOnError(async () => {
            return await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);
        });

        const formData = new FormData();

        const file = new Blob([buffer], { type: 'image/png' });

        formData.append('file', file);

        const uploadResponse = await retryOnError(async () => {
            return await fetch('https://cdn.ipfsscan.io/api/v0/add?pin=false', {
                method: 'POST',
                body: formData
            });
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.Hash) {
            throw new Error('Image upload failed');
        }

        const responseBody = {
            created: Math.floor(Date.now() / 1000),
            data: [
                { url: `https://cdn.ipfsscan.io/ipfs/${uploadResult.Hash}` }
            ]
        };

        return new Response(JSON.stringify(responseBody), {
            status: 200, // 添加 200 状态码
            headers: {
                'content-type': 'application/json'
            }
        });
    }
};

async function retryOnError(fn, retries = 1, timeout = 60000) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await Promise.race([
                fn(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                )
            ]);
        } catch (error) {
            if (i === retries) {
                throw error;
            }
        }
    }
}
