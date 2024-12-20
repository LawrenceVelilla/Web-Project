import json
import re

def extract_and_remove(description, pattern):
    """
    Extract and remove the matched text based on the pattern.
    """
    match = re.search(pattern, description)
    if match:
        extracted = match.group(1).strip()
        description = re.sub(pattern, "", description)
        return extracted, description
    return None, description

import re

def parse_courses(course_text):
    """
    Parse prerequisites or corequisites to extract groups like 'One of' and handle prefix propagation
    in both 'One of' and 'All of' sections.
    """
    parsed = []
    if not course_text:
        return parsed

    # Match all "One of" groups, case insensitive
    one_of_groups = re.finditer(r"(?:[Oo]ne of) (.+?)(?:,? and |\.|$)", course_text)
    for group in one_of_groups:
        options_text = group.group(1)
        # Split the options in the "One of" group
        options = re.split(r",|\bor\b", options_text)
        options = [opt.strip() for opt in options if opt.strip()]

        parsed_options = []
        current_prefix = None
        for opt in options:
            if re.match(r"^[A-Za-z]+\s*\d+$", opt): 
                current_prefix = opt.split()[0] 
                parsed_options.append(opt)
            elif re.match(r"^\d+$", opt) and current_prefix: 
                parsed_options.append(f"{current_prefix} {opt}")
            else:  # Fallback to raw option
                parsed_options.append(opt)

        parsed.append({"One of": parsed_options})

    # Remove matched "One of" groups from the text
    course_text = re.sub(r"(?:[Oo]ne of) .+?(?:,? and |\.|$)", "", course_text, flags=re.IGNORECASE)

    # Handle remaining conditions (e.g., standalone course names or "and")
    if course_text.strip():
        remaining_courses = [course.strip() for course in re.split(r",|and", course_text) if course.strip()]
        parsed_remaining = []
        current_prefix = None
        for course in remaining_courses:
            if re.match(r"^[A-Za-z]+\s*\d+$", course):  # This is the full course code e.g., "STAT 141"
                current_prefix = course.split()[0]  # Just extract the prefix to make it the current rolling prefix
                parsed_remaining.append(course)
            elif re.match(r"^\d+$", course) and current_prefix:  # Match only a number
                parsed_remaining.append(f"{current_prefix} {course}")
            else: 
                parsed_remaining.append(course)
        if parsed_remaining:
            parsed.append({"All of": parsed_remaining})

    return parsed

def update_courses(input_file, output_file):
    with open(input_file, 'r') as file:
        courses = json.load(file)

    for course in courses:
        description = course.get("description", "")

        
        pre_match = re.search(r"Prerequisite[s]*: (.*?)(?:\.|$)", description)
        co_match = re.search(r"Corequisite[s]*: (.*?)(?:\.|$)", description)

        prerequisites = []
        corequisites = []

        if pre_match and co_match:
            if pre_match.start() < co_match.start():
                co_text, description = extract_and_remove(description, r"Corequisite[s]*: (.*?)(?:\.|$)")
                corequisites = parse_courses(co_text)
            
                pre_text, description = extract_and_remove(description, r"Prerequisite[s]*: (.*?)(?:\.|$)")
                prerequisites = parse_courses(pre_text)

            elif co_match.start() < pre_match.start():
                pre_text, description = extract_and_remove(description, r"Prerequisite[s]*: (.*?)(?:\.|$)")
                prerequisites = parse_courses(pre_text)

                co_text, description = extract_and_remove(description, r"Corequisite[s]*: (.*?)(?:\.|$)")
                corequisites = parse_courses(co_text)
        
        elif pre_match:
            pre_text, description = extract_and_remove(description, r"Prerequisite[s]*: (.*?)(?:\.|$)")
            prerequisites = parse_courses(pre_text)
        
        elif co_match:
            co_text, description = extract_and_remove(description, r"Corequisite[s]*: (.*?)(?:\.|$)")
            corequisites = parse_courses(co_text)
    
        course["prerequisites"] = prerequisites
        course["corequisites"] = corequisites
        course["description"] = description.strip()

    # Save the updated course data from the raw data into a file
    with open(output_file, 'w') as file:
        json.dump(courses, file, indent=4)
    print(f"Updated course data saved to {output_file}")


input_file = "cs_classes.json"
output_file = "updated_csclasses.json"
update_courses(input_file, output_file)