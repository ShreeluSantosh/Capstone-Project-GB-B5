import asyncio
import pandas as pd
from twikit import Client
import os
from datetime import datetime
import logging

logging.basicConfig(filename='tweet_collector.log', level=logging.INFO)

# Initialize client
client = Client('en-US')

# Define the filename for Excel storage
EXCEL_FILE = "tweets.xlsx"

async def fetch_and_save_tweets():
    # Log in to the client
    await client.login(
        auth_info_1="Shreelu356903",
        auth_info_2="sanshreelu1911@protonmail.com",
        password="5A7ba5721"
    )

    logging.info(f"Fetching tweets at {datetime.now()}...")
    
    # Fetch latest tweets
    tweets = await client.search_tweet('#India #cyberattack', 'Latest', 40)

    # Collect tweet data in a list of dictionaries
    data = []
    for tweet in tweets:
        data.append({
            'Username': tweet.user.name,
            'Tweet': tweet.full_text,
            'Created At': tweet.created_at,
            'URLs': ', '.join(tweet.urls)
        })
    
    logging.info(f"Fetched {len(tweets)} tweets at {datetime.now()}")

    # Convert data into a pandas DataFrame
    df = pd.DataFrame(data)

    # If the Excel file exists, append data to it
    if os.path.exists(EXCEL_FILE):
        existing_df = pd.read_excel(EXCEL_FILE)
        df = pd.concat([existing_df, df], ignore_index=True)

    # Save the updated DataFrame to the Excel file
    df.to_excel(EXCEL_FILE, index=False)
    logging.info(f"Saved {len(tweets)} tweets to {EXCEL_FILE}.")

def main():
    fetch_and_save_tweets()

# Run the main function
asyncio.run(main())
