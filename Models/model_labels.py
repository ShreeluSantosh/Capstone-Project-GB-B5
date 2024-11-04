import pandas as pd
import numpy as np
import emoji, re
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Preprocessing function to handle emojis and special characters
def preprocess_tweet(tweet):
    # Remove emojis
    tweet = emoji.replace_emoji(tweet, replace='')  # Replace emojis with an empty string
    tweet = tweet.lower()  # Convert to lowercase
    tweet = re.sub(r'http\S+|www\S+|https\S+|t\.co\S*', '', tweet, flags=re.MULTILINE)  # Remove URLs including t.co
    tweet = re.sub(r'\@\w+|\#', '', tweet)  # Remove mentions and hashtags
    tweet = re.sub(r'\s+', ' ', tweet).strip()  # Remove extra spaces
    return tweet

# Load the dataset
print("Loading the datase")
df = pd.read_csv('tweets.csv', encoding='latin1')  # Update with your CSV file path

# Preprocess the dataset
df['cleaned_tweet'] = df['tweet'].apply(preprocess_tweet)

# Ensure that the labels are binary (0 or 1)
df['label_india'] = df['label_india'].apply(lambda x: 1 if x == 1 else 0)
df['label_cti'] = df['label_cti'].apply(lambda x: 1 if x == 1 else 0)

# Combine the labels into a single target variable
df['target'] = df[['label_india', 'label_cti']].apply(lambda x: x.tolist(), axis=1)

# Prepare the tweet texts and labels
tweets = df['cleaned_tweet'].astype(str).values
labels = np.array(list(df['target']))

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(tweets, labels, test_size=0.2, random_state=42)

# Tokenization and padding
tokenizer = Tokenizer(num_words=5000)  # Adjust the vocabulary size as needed
tokenizer.fit_on_texts(X_train)

X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)

# Pad sequences to ensure uniform input size
max_length = 50  # Adjust based on the average length of your tweets
X_train_pad = pad_sequences(X_train_seq, maxlen=max_length, padding='post')
X_test_pad = pad_sequences(X_test_seq, maxlen=max_length, padding='post')

# Build the model
model = keras.Sequential([
    layers.Embedding(input_dim=5000, output_dim=128, input_length=max_length),
    layers.GlobalAveragePooling1D(),
    layers.Dense(64, activation='relu'),
    layers.Dense(2, activation='sigmoid')  # Output layer for multi-label classification
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train_pad, y_train, epochs=10, batch_size=32, validation_split=0.2)

# Evaluate the model
loss, accuracy = model.evaluate(X_test_pad, y_test)
print(f'Test Accuracy: {accuracy * 100:.2f}%')

# Make predictions on the test set
predictions = model.predict(X_test_pad)
predictions = (predictions > 0.5).astype(int)  # Convert probabilities to binary predictions

# Display the predictions
for tweet, pred in zip(X_test, predictions):
    print(f'Tweet: {tweet}\nPredicted Labels: {pred}\n')
