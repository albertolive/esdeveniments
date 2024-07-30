import json
from bs4 import BeautifulSoup
import datetime
import pytz
from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree

# Load the JSON data and extract the HTML content
try:
    with open('events.json', 'r') as file:
        data = json.load(file)
    html_content = data['contingut']
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    exit(1)
except KeyError as e:
    print(f"Error: 'contingut' field not found in JSON data")
    exit(1)
except IOError as e:
    print(f"Error reading file: {e}")
    exit(1)

# Parse the HTML
soup = BeautifulSoup(html_content, 'html.parser')

# Find all event items
event_items = soup.find_all('li', id=lambda x: x and x.startswith('age'))

# Create the root element of the RSS feed
rss = Element('rss', version='2.0')
channel = SubElement(rss, 'channel')

# Add channel metadata
title = SubElement(channel, 'title')
title.text = 'Girona Events'
link = SubElement(channel, 'link')
link.text = 'https://www.girona.cat/cultura/cat/agenda.php'
description = SubElement(channel, 'description')
description.text = 'Upcoming events in Girona'

# Function to format date and time
def format_date_time(date_time_str):
    try:
        # Parse the date and time string
        date_time = datetime.datetime.strptime(date_time_str, '%a. %d/%m %H h')
        # Convert to UTC
        local_tz = pytz.timezone('Europe/Madrid')
        local_dt = local_tz.localize(date_time, is_dst=None)
        utc_dt = local_dt.astimezone(pytz.utc)
        return utc_dt.strftime('%a, %d %b %Y %H:%M:%S %z')
    except ValueError:
        return date_time_str

# Process each event
for event in event_items:
    item = SubElement(channel, 'item')

    # Extract event details
    event_title = event.find('h3').text.strip() if event.find('h3') else 'No Title'
    event_date = event.find('p', class_='tagged data').text.strip() if event.find('p', class_='tagged data') else ''
    event_type = event.find('p', class_='tipus').text.strip() if event.find('p', class_='tipus') else 'Unknown Type'
    event_location = event.find('p', class_='tagged lloc').text.strip() if event.find('p', class_='tagged lloc') else 'Unknown Location'

    # Add event details to RSS item
    title_elem = SubElement(item, 'title')
    title_elem.text = event_title

    link_elem = SubElement(item, 'link')
    link_elem.text = 'https://www.girona.cat/cultura/cat/agenda.php'

    description_elem = SubElement(item, 'description')
    description_elem.text = f"{event_type} at {event_location}"

    pubDate_elem = SubElement(item, 'pubDate')
    pubDate_elem.text = format_date_time(event_date)

# Save the RSS feed to a file
rss_feed = tostring(rss, encoding='utf-8', method='xml')
with open('events.rss', 'wb') as file:
    file.write(rss_feed)

print(f"RSS feed created with {len(event_items)} events.")
