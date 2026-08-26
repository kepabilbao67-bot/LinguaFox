import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { POST } from '../../app/api/chat+api';

// Simple polyfill for Jest if running in older Node
if (typeof Response === 'undefined') {
  globalThis.Response = class {
    static json(body: any, init?: { status?: number }) {
      return {
        status: init?.status || 200,
        json: async () => body,
      } as any;
    }
  } as any;
}

function createRequest(body: any) {
  return {
    json: async () => body,
  } as Request;
}

const originalEnv = process.env;

beforeEach(() => {
  vi.clearAllMocks();
  process.env = { ...originalEnv };
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  process.env = originalEnv;
});

describe('POST /api/chat', () => {
  it('1 & 2. user y assistant llegan correctamente a OpenAI, no se transforma', async () => {
    process.env.OPENAI_API_KEY = 'test_key_ficticia';
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ text: 'hi', suggestions: [], correction: null }) } }]
      })
    });

    const req = createRequest({
      messages: [
        { role: 'user', text: 'hello' },
        { role: 'assistant', text: 'hi' },
      ]
    });

    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(200);

    const fetchArgs = (globalThis.fetch as Mock).mock.calls[0];
    const payload = JSON.parse(fetchArgs[1].body);
    
    expect(payload.messages[1].role).toBe('user');
    expect(payload.messages[2].role).toBe('assistant');
  });

  it('3. rol desconocido devuelve 400', async () => {
    const req = createRequest({ messages: [{ role: 'admin', text: 'x' }] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(400);
  });

  it('4. mensajes vacíos devuelven 400', async () => {
    const req = createRequest({ messages: [] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(400);
  });

  it('5. más de 10 mensajes se rechazan', async () => {
    const messages = Array.from({ length: 11 }, () => ({ role: 'user', text: 'hi' }));
    const req = createRequest({ messages });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(400);
  });

  it('6. texto superior a 2.000 caracteres devuelve 400', async () => {
    const req = createRequest({ messages: [{ role: 'user', text: 'a'.repeat(2001) }] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(400);
  });

  it('7. ausencia de clave devuelve 503', async () => {
    delete process.env.OPENAI_API_KEY;
    const req = createRequest({ messages: [{ role: 'user', text: 'hi' }] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(503);
  });

  it('8. proveedor HTTP 500 devuelve 502 sanitizado', async () => {
    process.env.OPENAI_API_KEY = 'test';
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error details'
    });

    const req = createRequest({ messages: [{ role: 'user', text: 'hi' }] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(502);
    
    const body = await res.json();
    expect(body.error).toBe('Provider Error');
  });

  it('9. JSON inválido devuelve 502', async () => {
    process.env.OPENAI_API_KEY = 'test';
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'invalid json {' } }]
      })
    });

    const req = createRequest({ messages: [{ role: 'user', text: 'hi' }] });
    const res = await POST(req) as unknown as Response;
    expect(res.status).toBe(502);
  });

  it('10. respuesta válida produce text, correction y suggestions', async () => {
    process.env.OPENAI_API_KEY = 'test';
    const mockReply = { text: 't', suggestions: ['1'], correction: { correctedText: 'c', explanation: 'e' } };
    (globalThis.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(mockReply) } }]
      })
    });

    const req = createRequest({ messages: [{ role: 'user', text: 'hi' }] });
    const res = await POST(req) as unknown as Response;
    
    const data = await res.json();
    expect(data).toEqual(mockReply);
  });
});
