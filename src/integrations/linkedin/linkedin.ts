import { Integration, OAuth2Credentials, AuthType } from '../base';

/**
 * LinkedIn integration class
 * Provides methods for interacting with LinkedIn API
 */
export class LinkedInIntegration extends Integration<OAuth2Credentials> {
  readonly name = 'linkedin';
  readonly providerConfigKey = 'linkedin';

  /**
   * Get LinkedIn access token directly with type safety
   * No need for manual type checking!
   */
  public async getAccessToken(): Promise<string> {
    return this.getAuthToken(); // TypeScript knows this returns a string
  }

  public async createTextPost(text: string, visibility: "PUBLIC" | "PRIVATE" = "PUBLIC") {
    // First, get user information to extract LinkedIn user ID
    const userInfoResponse = await this.proxyRequest({
      baseUrlOverride: 'https://api.linkedin.com/',
      method: 'GET',
      endpoint: '/v2/userinfo',
    });

    if (!userInfoResponse.data?.sub) {
      return Response.json(
        { success: false, error: 'LinkedIn user ID not found' },
        { status: 400 }
      );
    }

    const linkedInUserId = userInfoResponse.data.sub;
    // Prepare the LinkedIn post payload following the ugcPosts API format
    const postPayload = {
      author: `urn:li:person:${linkedInUserId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': visibility,
      },
    };

    // Create the post using Nango's proxy
    const postResponse = await this.proxyRequest({
      method: 'POST',
      baseUrlOverride: 'https://api.linkedin.com/',
      endpoint: '/v2/ugcPosts',
      data: postPayload,
    });
    return Response.json({
      success: true,
      data: {
        postId: postResponse.data?.id,
        postUrl: postResponse.data?.permalink,
        message: 'Post created successfully',
      },
    });
  }
} 