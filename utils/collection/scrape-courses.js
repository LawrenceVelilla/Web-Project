const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
import { RawCourse, Course } from '../../lib/types';

export async function scrapeCourses(url) {
  try {
    const response = await axios.get(url);
    return parseCoursesHTML(response.data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function parseCoursesHTML(html) {
  const $ = cheerio.load(html);
  const courses = [];
  
  $('.course.first').each((_, element) => {
    const $course = $(element);
    
    // Extract course header info
    const headerText = $course.find('h2 a').text().trim();
    const courseUrl = $course.find('h2 a').attr('href');
    
    // Parse course code and title
    const codeTitleMatch = headerText.match(/^([A-Z]+\s\d+)\s*[-–—]?\s*(.*)/);
    let courseCode = codeTitleMatch ? codeTitleMatch[1] : '';
    let title = codeTitleMatch ? codeTitleMatch[2] : headerText;

   const sectionMatch = title.match(/^([A-Z])\s*-\s*(.*)/);
   if (sectionMatch) {
     // Add the section to the course code (no space between number and section)
     courseCode = courseCode + sectionMatch[1];
     // Clean up the title by removing the section prefix
     title = sectionMatch[2].trim();
   }


    // Ectract department
    const department = courseCode.split(' ')[0];
    
    // Extract units
    const unitsText = $course.find('b').text().trim();
    const unitsMatch = unitsText.match(/(\d+)\s+units\s+\(fi\s+(\d+)\)\s*\(([^)]+)\)/);
    const units = {
      credits: unitsMatch ? parseInt(unitsMatch[1]) : null,
      feeIndex: unitsMatch ? parseInt(unitsMatch[2]) : null,
      term: unitsMatch ? unitsMatch[3] : null
    };
    
    // Extract description
    let description = $course.find('p').text().trim();
    // Clean up description (remove the debugging info at the end)
    description = description.replace(/"\s*==\s*\$\d+$/, '').trim();
    // Remove surrounding quotes if present
    description = description.replace(/^"(.+)"$/, '$1');
    
    courses.push({
      department,
      courseCode,
      title,
      units,
      description,
      url: courseUrl
    });
  });
  
  return courses;
}

// async function main() {
//   const courses = await scrapeCourses('https://apps.ualberta.ca/catalogue/course/cmput');
//   fs.writeFileSync('courses.json', JSON.stringify(courses, null, 2));
//   console.log(`Scraped ${courses.length} courses`);
// }

// main();