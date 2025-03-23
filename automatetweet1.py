import asyncio
from twikit import Client
import pandas as pd
from pymongo import MongoClient

# Twikit and MongoDB Configuration
USERNAME = 'example_user'
EMAIL = 'email@example.com'
PASSWORD = 'password0000'

TWIKIT_AUTH_1 = "AvshreeM37515"
TWIKIT_AUTH_2 = "avshree12825@proton.me"
TWIKIT_PASSWORD = "avshree12825"

MONGO_URI = "mongodb+srv://shreelu:2A8bc9ws@cluster0.irbc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "Tweets"
COLLECTION_NAME = "Automated_Tweets"

EXCEL_FILE = "tweets.xlsx"

# Initialize Twikit Client
client = Client('en-US')

# Function to fetch tweets and save to Excel
async def fetch_and_save_tweets():
    await client.login(auth_info_1=TWIKIT_AUTH_1, auth_info_2=TWIKIT_AUTH_2, password=TWIKIT_PASSWORD)
    
    # Fetch tweets
    tweets = await client.search_tweet('#India #threatintel', 'Latest', 50)
    data = []
    for tweet in tweets:
        data.append({
            "user": tweet.user.name,
            "text": tweet.full_text,
            "created_at": tweet.created_at,
            "urls": ', '.join(tweet.urls) if tweet.urls else None
        })
    
    # Convert data to a DataFrame
    df_new = pd.DataFrame(data)

    # Append to Excel
    try:
        # Load existing Excel file and append new data
        df_existing = pd.read_excel(EXCEL_FILE)
        df_combined = pd.concat([df_existing, df_new], ignore_index=True).drop_duplicates()
    except FileNotFoundError:
        # Create new Excel file if it doesn't exist
        df_combined = df_new
    
    df_combined.to_excel(EXCEL_FILE, index=False)

# Function to insert new records from Excel to MongoDB
def insert_into_mongodb():
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    
    # Load Excel data
    df = pd.read_excel(EXCEL_FILE)

    # Insert data into MongoDB
    records = df.to_dict(orient='records')
    for record in records:
        # Ensure no duplicate entries
        if not collection.find_one({"tweet": record["text"], "timestamp": record["created_at"], "user_account": record["user"]}):
            collection.insert_one(record)

# Main periodic execution function
async def main():
    while True:
        print("Fetching tweets and updating data...")
        await fetch_and_save_tweets()
        insert_into_mongodb()
        print("Data updated successfully. Waiting for the next interval...")
        await asyncio.sleep(2 * 60 * 60)  # Wait for 2 hours (2 hours * 60 minutes/hour * 60 seconds/minute)

if __name__ == "__main__":
    asyncio.run(main())
