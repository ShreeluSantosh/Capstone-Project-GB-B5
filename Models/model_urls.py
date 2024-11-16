import re
import numpy as np
import pandas as pd
from whois import whois
import datetime
from datetime import date
import mechanicalsoup
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Load the dataset
print("Loading the dataset...")
df = pd.read_csv('urls.csv')

df2 = df.loc[0:]

print("Preprocessing the dataset...")

#creating instance of one-hot-encoder
encoder = OneHotEncoder(handle_unknown='ignore')

#perform one-hot encoding on 'team' column 
encoder_df = pd.DataFrame(encoder.fit_transform(df2[['Label']]).toarray())

#merge one-hot encoded columns back with original DataFrame
df3 = df2.join(encoder_df)

df3 = df3.drop(['Label'], axis=1)
df3.columns = ['URL', 'Label_bad', 'Label_good']
df3 = df3.drop(['Label_good'], axis=1)

# function for extracting urls from email body 

def Find(content):
    regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    url = re.findall(regex, content)
    return [x[0] for x in url]

# defining functions for each of the phishing features
  
def phishtank_check(i):
  browser = mechanicalsoup.StatefulBrowser()
  browser.open("https://www.phishtank.com/")
  try:
    form = browser.select_form(selector='form', nr=1)
    browser["isaphishurl"] = i
    my_button = browser.get_current_page().find('input', value='Is it a phish?')
    response = browser.submit_selected(btnName = my_button)
    s1 = 'This site is not a phishing site.'
    s2 = 'Is a phish'
    if s1 in response.text:
      return 0
    elif s2 in response.text:
      return 1
    else:
      return 0.5
  except:
    return 0.7

def numOfDays(date1, date2):
    return (date2-date1).days

def domain_check(url):
    try:
        domain_info = whois(url)
        creation_date = domain_info.creation_date
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        if isinstance(creation_date, datetime.datetime):
            creation_date = creation_date.date()

        today = date.today()
        age_in_days = (today - creation_date).days
        return 1 if age_in_days <= 150 else 0
    except Exception as e:
        return 1

def url_character_check(i):
  if '@' in i:
    return 1
  else:
    return 0

def ip_check(i):
  if 'www.' in i:
    p = i.index('www.')
    if type(i[p+4]) == int:
      return 1
    else:
      return 0
  else:
    return 0

def url_length(i):
  if len(i) > 100:   
    return 1
  else:
    return 0

def form_tag_check(i):
  browser = mechanicalsoup.StatefulBrowser()
  try:
    browser.open(i)
    form = browser.select_form()
    return 0
  except:
    return 1

def count(l):
  c = 0
  for x in l:
    c += 1
  if c > 0:
      return 1
  else:
    return 0  
  
print("Checking each URL in the dataset for phishing signs using:")

print("Link count") 
df3['link'] = df3.apply(lambda row: count(row['URL']), axis=1)
print("URL length")
df3['length'] = df3.apply(lambda row: url_length(row['URL']), axis=1)
print("PhishTank check")
df3['phishtank'] = df3.apply(lambda row: phishtank_check(row['URL']), axis=1)
print("WHOIS domain check")
df3['domain'] = df3.apply(lambda row: domain_check(row['URL']), axis=1)
print("IP address check")
df3['ip_address'] = df3.apply(lambda row: ip_check(row['URL']), axis=1)
print("Looking for @ symbol")
df3['attherate'] = df3.apply(lambda row: url_character_check(row['URL']), axis=1)
print("Looking for form tag")
df3['form_tag'] = df3.apply(lambda row: form_tag_check(row['URL']), axis=1)

# Instantiate model with 1000 decision trees
rf = RandomForestRegressor(n_estimators = 20, random_state = 42)

# Labels are the values we want to predict
labels = np.array(df3['Label_bad'])
# axis 1 refers to the columns
df4 = df3.drop(['URL'], axis = 1)
features= df4.drop(['Label_bad'], axis = 1)
# Saving feature names for later use
feature_list = list(features.columns)
# Convert to numpy array
features = np.array(features)

print("Preparing training and testing sets")
train_features, test_features, train_labels, test_labels = train_test_split(features, labels, test_size = 0.25, random_state = 42)

# Train the model on training data
print("Training the model")
rf.fit(train_features, train_labels)

print("Predicting values for testing set")
predictions = rf.predict(test_features)

print("Results:")

# Calculate the absolute errors
errors = abs(predictions - test_labels)
# Print out the mean absolute error (mae)
mae = round(np.mean(errors),2)
print('Mean Absolute Error:', mae)

# Calculate mean absolute percentage error (MAPE)
mape = (mae / len(test_labels))*100
# Calculate and display accuracy
accuracy = 100 - np.mean(mape)
print('Accuracy:', round(accuracy, 2), '%.')