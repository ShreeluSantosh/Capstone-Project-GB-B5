import pandas as pd
import numpy as np
import emoji, re
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score
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
print("Loading the dataset...")
df = pd.read_csv('tweets1.csv', encoding='latin1')  # Update with your CSV file path

# Preprocess the dataset
df['cleaned_tweet'] = df['tweet'].apply(preprocess_tweet)

# Ensure that the labels are binary (0 or 1)
df['label_india'] = df['label_india'].apply(lambda x: 1 if x == 1 else 0)
df['label_cti'] = df['label_cti'].apply(lambda x: 1 if x == 1 else 0)

# Prepare the tweet texts
tweets = df['cleaned_tweet'].astype(str).values

# Split the dataset and tokenize for both labels
def prepare_data(tweets, labels, tokenizer=None):
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(tweets, labels, test_size=0.2, random_state=42)
    
    # Tokenize and pad sequences
    if tokenizer is None:
        tokenizer = Tokenizer(num_words=5000)  # Adjust the vocabulary size as needed
        tokenizer.fit_on_texts(X_train)
    
    X_train_seq = tokenizer.texts_to_sequences(X_train)
    X_test_seq = tokenizer.texts_to_sequences(X_test)
    
    max_length = 50  # Adjust based on the average length of your tweets
    X_train_pad = pad_sequences(X_train_seq, maxlen=max_length, padding='post')
    X_test_pad = pad_sequences(X_test_seq, maxlen=max_length, padding='post')
    
    return X_train_pad, X_test_pad, y_train, y_test, tokenizer

# Build and train a separate model for a specific label
def train_model(X_train, X_test, y_train, y_test, label_name):
    model = keras.Sequential([
        layers.Embedding(input_dim=5000, output_dim=128, input_length=50),
        layers.GlobalAveragePooling1D(),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')  # Single output for binary classification
    ])
    
    # Compile the model with accuracy as a metric
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    print(f"Training model for {label_name}...")
    model.fit(X_train, y_train, epochs=10, batch_size=32, validation_split=0.2)
    
    # Evaluate the model on the test set
    loss, accuracy = model.evaluate(X_test, y_test)
    
    # Predict on the test set and calculate precision
    y_pred = model.predict(X_test)
    y_pred_binary = (y_pred > 0.5).astype(int)  # Convert probabilities to binary
    
    precision = precision_score(y_test, y_pred_binary)
    
    print(f"{label_name} - Test Accuracy: {accuracy * 100:.2f}%")
    print(f"{label_name} - Test Precision: {precision:.2f}")
    
    return model

# Prepare data and train the model for 'label_india'
X_train_india, X_test_india, y_train_india, y_test_india, tokenizer_india = prepare_data(tweets, df['label_india'])
model_india = train_model(X_train_india, X_test_india, y_train_india, y_test_india, 'label_india')

# Prepare data and train the model for 'label_cti'
X_train_cti, X_test_cti, y_train_cti, y_test_cti, tokenizer_cti = prepare_data(tweets, df['label_cti'], tokenizer_india)
model_cti = train_model(X_train_cti, X_test_cti, y_train_cti, y_test_cti, 'label_cti')

# Make predictions for both models
print("\nPredictions for label_india:")
predictions_india = model_india.predict(X_test_india)
predictions_india = (predictions_india > 0.5).astype(int)

for tweet, pred in zip(X_test_india, predictions_india):
    print(f'Tweet: {tokenizer_india.sequences_to_texts([tweet])[0]}\nPredicted Label (India): {pred[0]}\n')

print("\nPredictions for label_cti:")
predictions_cti = model_cti.predict(X_test_cti)
predictions_cti = (predictions_cti > 0.5).astype(int)

for tweet, pred in zip(X_test_cti, predictions_cti):
    print(f'Tweet: {tokenizer_cti.sequences_to_texts([tweet])[0]}\nPredicted Label (CTI): {pred[0]}\n')

