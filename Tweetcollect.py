import asyncio
from twikit import Client

USERNAME = 'example_user'
EMAIL = 'email@example.com'
PASSWORD = 'password0000'

# Initialize client
client = Client('en-US')

# Add your X account credentials
async def main():
    await client.login(
        auth_info_1="" , # Add username
        auth_info_2="",  # Add email address
        password=""      # Add password
    )

    # Change the hashtags to get different results
    tweets = await client.search_tweet('#malware #India', 'Latest', 30)

    for tweet in tweets:
        print(
            tweet.user.name,
            tweet.text,
            tweet.created_at
        )

asyncio.run(main())
