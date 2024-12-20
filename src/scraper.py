# -*- coding: utf-8 -*-
"""web-project.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/10LHK4t4ENmKw-VcHPJhZYwfw-hF-S4Ur
"""



import requests
from bs4 import BeautifulSoup
import json
import re


# URL of the course catalog or specific class listings
URL = "https://apps.ualberta.ca/catalogue/course/math"  # Replace with the actual URL

def extract_and_remove(description, pattern):
    """Extract and remove the matched text based on the pattern."""
    match = re.search(pattern, description)
    if match:
        extracted = match.group(1).strip()
        description = re.sub(pattern, "", description)
        return extracted, description
    return None, description

def parse_courses(course_text):
    """Parse and clean course prerequisites/corequisites into a list."""
    if not course_text:
        return []
    # Normalize by removing "and" and splitting on commas
    cleaned_text = re.sub(r"\band\b", "", course_text, flags=re.IGNORECASE)
    courses = [course.strip() for course in cleaned_text.split(",") if course.strip()]
    return courses


def scrape_courses(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch the webpage. Status code: {response.status_code}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')

    courses = []
    # Target each course container
    for course_section in soup.find_all("div", class_="mb-3 pb-3 border-bottom"):
        # Extract course title
        title_tag = course_section.select_one("h2 a")
        course_title = title_tag.text.strip() if title_tag else "No Title"

        # Extract description text
        description_tag = course_section.find("p")
        description = description_tag.text.strip() if description_tag else "No Description"




        # Append the course details
        courses.append({
            "course_title": course_title,
            "description": description,

        })

    return courses

# Run the scraper
data = scrape_courses(URL)

if data:
    # Save the data to a JSON file
    with open("courses.json", "w") as file:
        json.dump(data, file, indent=4)
    print("Data saved to courses.json")

    # Print the scraped data
    print(json.dumps(data, indent=4))

import pandas as pd


df = pd.read_json("updated_csclasses.json")

print(df)

