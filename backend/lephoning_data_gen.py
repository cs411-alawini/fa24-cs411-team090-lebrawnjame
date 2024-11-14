# Script to generate fake Events data

import csv
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()
event_choices = ['Fan Meet-Up', 'Concert', 'Merch Sale Event', 'Tour', 'Reality Show']
cities = [
    "Tokyo, Japan",
    "Delhi, India",
    "Shanghai, China",
    "São Paulo, Brazil",
    "Mexico City, Mexico",
    "Dhaka, Bangladesh",
    "Cairo, Egypt",
    "Beijing, China",
    "Mumbai, India",
    "Osaka, Japan",
    "Chongqing, China",
    "Karachi, Pakistan",
    "Istanbul, Turkey",
    "Kinshasa, DR Congo",
    "Lagos, Nigeria",
    "Buenos Aires, Argentina",
    "Kolkata, India",
    "Manila, Philippines",
    "Tianjin, China",
    "Rio de Janeiro, Brazil"
]
member_ids = [1, 2, 3, 4, 5]

def random_date_range():
    start_date = fake.date_time_between(start_date="-3y", end_date="now").replace(minute=0, second=0, microsecond=0)
    duration = timedelta(hours=random.randint(1, 4))
    end_date = start_date + duration
    return start_date, end_date

with open('events.csv', 'w', newline='') as csvfile:
    fieldnames = ['EventID', 'EventName', 'StartDate', 'EndDate', 'Location', 'MemberId']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for event_id in range(1, 1501):
        start_date, end_date = random_date_range()
        writer.writerow({
            'EventID': event_id,
            'EventName': random.choice(event_choices),
            'StartDate': start_date.strftime("%Y-%m-%d %H:%M:%S"),
            'EndDate': end_date.strftime("%Y-%m-%d %H:%M:%S"),
            'Location': random.choice(cities),
            'MemberId': random.choice(member_ids)
        })

# Script to generate fake User data

import csv
from faker import Faker
import random

fake = Faker()

cities = [
    "Tokyo, Japan", "Delhi, India", "Shanghai, China", "São Paulo, Brazil", "Mexico City, Mexico",
    "Dhaka, Bangladesh", "Cairo, Egypt", "Beijing, China", "Mumbai, India", "Osaka, Japan",
    "Chongqing, China", "Karachi, Pakistan", "Istanbul, Turkey", "Kinshasa, DR Congo", "Lagos, Nigeria",
    "Buenos Aires, Argentina", "Kolkata, India", "Manila, Philippines", "Tianjin, China", "Rio de Janeiro, Brazil",
    "Guangzhou, China", "Lahore, Pakistan", "Moscow, Russia", "Bangalore, India", "Shenzhen, China",
    "Jakarta, Indonesia", "London, United Kingdom", "Lima, Peru", "Bangkok, Thailand", "Bogotá, Colombia",
    "Chennai, India", "Paris, France", "Hyderabad, India", "Lahore, Pakistan", "Wuhan, China",
    "Nagoya, Japan", "Chicago, United States", "Chengdu, China", "Nanjing, China", "Tehran, Iran",
    "Ho Chi Minh City, Vietnam", "Luanda, Angola", "Ahmedabad, India", "Kuala Lumpur, Malaysia", "New York, United States",
    "Hong Kong, China", "Baghdad, Iraq", "Pune, India", "Suzhou, China", "Shijiazhuang, China",
    "Toronto, Canada", "Santiago, Chile", "Riyadh, Saudi Arabia", "Miami, United States", "Durban, South Africa",
    "Pyongyang, North Korea", "Barcelona, Spain", "Dallas, United States", "Philadelphia, United States", "Fukuoka, Japan",
    "Medellín, Colombia", "Houston, United States", "São Luís, Brazil", "Singapore, Singapore", "Brasília, Brazil",
    "Atlanta, United States", "Melbourne, Australia", "Nairobi, Kenya", "Jeddah, Saudi Arabia", "Rome, Italy",
    "Munich, Germany", "Yokohama, Japan", "Buenos Aires, Argentina", "Khartoum, Sudan", "Belo Horizonte, Brazil",
    "Kampala, Uganda", "Recife, Brazil", "Tashkent, Uzbekistan", "Lisbon, Portugal", "Sydney, Australia",
    "Accra, Ghana", "Monterrey, Mexico", "San Diego, United States", "Pretoria, South Africa", "Kigali, Rwanda",
    "Casablanca, Morocco", "Abidjan, Ivory Coast", "Antananarivo, Madagascar", "Kuwait City, Kuwait", "Zagreb, Croatia",
    "Thessaloniki, Greece", "Amsterdam, Netherlands", "Porto Alegre, Brazil", "Lusaka, Zambia", "Tel Aviv, Israel",
    "Stockholm, Sweden", "San Antonio, United States", "Guatemala City, Guatemala", "Kyiv, Ukraine", "Milan, Italy"
]
email_endings = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com']

num_users = 2000
usernames = set()
while len(usernames) < num_users:
    username = fake.user_name()
    usernames.add(username)
usernames = list(usernames)

with open('users.csv', 'w', newline='') as csvfile:
    fieldnames = ['Username', 'Email', 'MembershipStatus', 'Location']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for i in range(2000):
        username = usernames[i]
        email = username + random.choice(email_endings)
        membership_status = random.choice([True, False])
        location = random.choice(cities)

        writer.writerow({
            'Username': username,
            'Email': email,
            'MembershipStatus': membership_status,
            'Location': location
        })

        usernames.append(username)

# Script to generate fake Messages data

import csv
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

member_ids = [1, 2, 3, 4, 5]

with open('messages.csv', 'w', newline='') as csvfile:
    fieldnames = ['MessageID', 'Username', 'MemberId', 'SentBy', 'Content', 'Time']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for message_id in range(1, 30001):
        username = random.choice(usernames)
        member_id = random.choice(member_ids)
        sent_by = random.choice([True, False])
        content = fake.text(max_nb_chars=random.randint(20, 100))
        time = fake.date_time_between(start_date="-3y", end_date="now")

        writer.writerow({
            'MessageID': message_id,
            'Username': username,
            'MemberId': member_id,
            'SentBy': sent_by,
            'Content': content,
            'Time': time.strftime("%Y-%m-%d %H:%M:%S")
        })

# Script to generate fake Shop data

import csv
from faker import Faker
import random
import re

fake = Faker()

domain_endings = [".com", ".net", ".us", ".org", ".co"]

merchants = set()
while len(merchants) < 20:
    merchant_name = fake.company()
    merchants.add(merchant_name)
merchants = list(merchants)

merch_types = ["T-shirt", "Keychain", "Album", "Poster", "Sticker", "Mug",
               "Hoodie", "Cap", "Phone Case", "Notebook", "Backpack", "Scarf",
               "Badge", "Sweatshirt", "Pen", "Water Bottle", "Socks", "Pillow",
               "Mask", "Tote Bag"]

dict = {}
for merchant in merchants:
    dict[merchant] = random.choice(domain_endings)

with open('shop.csv', 'w', newline='') as csvfile:
    fieldnames = ['ItemID', 'MerchType', 'Merchant', 'Link']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for item_id in range(1, 2001):
        merch_type = random.choice(merch_types)
        merchant = random.choice(merchants)
        link = "www." + re.sub(r'[^a-zA-Z\s]+', '', merchant.lower()).replace(" ", "-") + dict[merchant]

        writer.writerow({
            'ItemID': item_id,
            'MerchType': merch_type,
            'Merchant': merchant,
            'Link': link
        })

# Script to generate fake Shop Preferences data

import csv
from faker import Faker
import random

fake = Faker()

biases = ["Chaewon", "Kazuha", "Sakura", "Eunchae", "Yunjin"]

with open('shop_pref.csv', 'w', newline='') as csvfile:
    fieldnames = ['Username', 'ItemID', 'Bias', 'EventName']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for item_id in range(1, 2001):
        username = random.choice(usernames)
        bias = random.choice(biases)
        event_name = random.choice(event_choices)

        writer.writerow({
            'Username': username,
            'ItemID': item_id,
            'Bias': bias,
            'EventName': event_name
        })

# Script to generate fake Content Preferences data

import csv
from faker import Faker
import random

fake = Faker()

biases = ["Chaewon", "Kazuha", "Sakura", "Eunchae", "Yunjin"]

with open('content_pref.csv', 'w', newline='') as csvfile:
    fieldnames = ['Username', 'ItemID', 'Bias', 'EventName']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for item_id in range(1, 2001):
        username = random.choice(usernames)
        media_id =
        bias = random.choice(biases)
        event_name = random.choice(event_choices)

        writer.writerow({
            'Username': username,
            'ItemID': item_id,
            'Bias': bias,
            'EventName': event_name
        })