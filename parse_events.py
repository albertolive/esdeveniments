import json
import re

# Load the HTML content from the saved output file
with open('/home/ubuntu/full_outputs/curl_https_www_giron_1721897187.1292694.txt', 'r') as file:
    data = json.load(file)
    html_content = data['contingut']

# Extract event details using regular expressions
events = re.findall(r'<li id="age\d+".*?<\/li>', html_content, re.DOTALL)
event_list = []

for event in events:
    title = re.search(r'<h3>(.*?)<\/h3>', event).group(1)
    date_time = re.search(r'<p class="tagged data">(.*?)<\/p>', event).group(1)
    event_type = re.search(r'<p class="tipus">(.*?)<\/p>', event).group(1)
    location = re.search(r'<p class="tagged lloc">(.*?)<\/p>', event).group(1)
    category = re.search(r'<span class=\'col-ambit\'>(.*?)<\/span>', event).group(1)
    
    event_details = {
        'title': title,
        'date_time': date_time,
        'event_type': event_type,
        'location': location,
        'category': category
    }
    
    event_list.append(event_details)

# Print the structured event data in JSON format
print(json.dumps(event_list, ensure_ascii=False, indent=2))
