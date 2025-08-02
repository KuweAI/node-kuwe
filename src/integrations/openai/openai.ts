import OpenAI from 'openai';

/**
 * OpenAI Integration class
 * Provides methods for interacting with OpenAI API using the official OpenAI library
 * Uses OPENAI_API_KEY environment variable for authentication
 */
export class OpenAIIntegration {
    readonly name = 'openai';
    private client: OpenAI;

    constructor(apiKey?: string) {
        // Use provided API key or fall back to environment variable
        const key = apiKey || process.env.OPENAI_API_KEY;

        if (!key) {
            throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it to the constructor.');
        }

        this.client = new OpenAI({
            apiKey: key,
        });
    }

    /**
     * Create a chat completion using the messages format
     * @param messages - Array of messages for the conversation
     * @param model - OpenAI model to use (default: 'gpt-4')
     * @param options - Additional options for the completion
     */
    public async createChatCompletion(
        messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
        model: string = 'gpt-4',
        options?: {
            temperature?: number;
            max_tokens?: number;
            top_p?: number;
            frequency_penalty?: number;
            presence_penalty?: number;
            stream?: boolean;
        }
    ) {
        try {
            const response = await this.client.chat.completions.create({
                model,
                messages,
                ...options,
            });

            return {
                success: true,
                data: response,
                message: 'Chat completion created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                message: 'Failed to create chat completion'
            };
        }
    }

      /**
   * Simple text completion method
   * @param input - Text input for completion
   * @param model - OpenAI model to use (default: 'gpt-4')
   * @param options - Additional options
   * @returns The text response directly
   * @throws Error if the completion fails
   */
  public async complete(
    input: string,
    model: string = 'gpt-4',
    options?: {
      temperature?: number;
      max_tokens?: number;
      system?: string;
    }
  ): Promise<string> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    
    if (options?.system) {
      messages.push({ role: 'system', content: options.system });
    }
    
    messages.push({ role: 'user', content: input });

    const response = await this.createChatCompletion(messages, model, {
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to create completion');
    }

    if (!response.data || !('choices' in response.data) || !response.data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    return response.data.choices[0].message.content;
  }
}