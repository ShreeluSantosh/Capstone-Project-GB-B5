import asyncio
from twikit import Client
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import re

USERNAME = 'example_user'
EMAIL = 'email@example.com'
PASSWORD = 'password0000'

# List of hashtags to search for; enter any number of hashtags from the word cloud list in the Gdrive folder
HASHTAGS = []

# Initialize client
client = Client('en-US')

async def fetch_tweets(hashtags):
    await client.login(
        auth_info_1="" ,   #username
        auth_info_2="",    #email address
        password=""        #password
    )
    
    # Create a hashtag search query string from the list
    hashtag_query = ' '.join(f'#{tag}' for tag in hashtags)
    
    # Search for tweets with specific hashtags
    tweets = await client.search_tweet(hashtag_query, 'Latest', 30)

    return tweets

def process_text(texts):
    # Combine all tweet texts into a single string
    all_text = ' '.join(texts)
    
    # Remove URLs, mentions, hashtags, and non-alphanumeric characters
    all_text = re.sub(r'http\S+|@\S+|#\S+', '', all_text)
    all_text = re.sub(r'[^a-zA-Z\s]', '', all_text)
    all_text = all_text.lower()
    
    return all_text

def generate_wordcloud(text):
    # Generate a word cloud image
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    
    # Display the word cloud using matplotlib
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.show()

def display_tweets(tweets):
    # Display a list of tweets
    print("Latest Tweets:")
    for tweet in tweets:
        print(f"User: {tweet.user.name}")
        print(f"Tweet: {tweet.text}")
        print(f"Created At: {tweet.created_at}")
        print("-" * 40)

async def main():
    tweets = await fetch_tweets(HASHTAGS)
    
    # Extract tweet texts for word cloud generation
    tweet_texts = [tweet.text for tweet in tweets]
    text = process_text(tweet_texts)
    
    # Display the list of tweets
    display_tweets(tweets)
    
    # Generate and display the word cloud
    generate_wordcloud(text)

# Run the main function
asyncio.run(main())
