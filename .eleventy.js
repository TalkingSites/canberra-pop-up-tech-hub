const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const fs = require('fs');
const path = require('path');

dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

module.exports = function (eleventyConfig) {
  //admin is left unprocessed and copied to site
  eleventyConfig.ignores.add("src/admin/index.html");
  eleventyConfig.ignores.add("src/admin/**/*.html");
  eleventyConfig.addPassthroughCopy("src/admin");

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Gallery images reader
  eleventyConfig.addGlobalData('galleries', function() {
    const galleries = {};
    
    function scanGalleryDirectory(dirPath, filterPrefix = null) {
      const fullPath = path.join(__dirname, 'src', dirPath);
      
      try {
        if (!fs.existsSync(fullPath)) {
          console.log(`Gallery directory not found: ${dirPath}`);
          return [];
        }
        
        const files = fs.readdirSync(fullPath);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        
        let images = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });
        
        // Filter by prefix if provided (e.g., 'gallery-')
        if (filterPrefix) {
          images = images.filter(file => file.startsWith(filterPrefix));
        }
        
        images.sort();
        
        if (images.length === 0) {
          console.log(`No images found in ${dirPath}${filterPrefix ? ' with prefix "' + filterPrefix + '"' : ''}`);
        } else {
          console.log(`Found ${images.length} images in ${dirPath}${filterPrefix ? ' with prefix "' + filterPrefix + '"' : ''}`);
        }
        
        return images;
      } catch (error) {
        console.error(`Error reading gallery directory ${dirPath}:`, error.message);
        return [];
      }
    }
    
    // Register a gallery path scanner
    galleries.scan = function(dirPath, filterPrefix = null) {
      const key = dirPath + (filterPrefix || '');
      if (!galleries[key]) {
        galleries[key] = scanGalleryDirectory(dirPath, filterPrefix);
      }
      return galleries[key];
    };
    
    return galleries;
  });

  // All events (sorted by date ascending)
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/posts/*.md")
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate));
  });

  // Upcoming events (includes today)
  eleventyConfig.addCollection("upcomingEvents", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate && dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today))
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  // Past events (before today)
  eleventyConfig.addCollection("pastEvents", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate && dayjs(e.data.eventDate).startOf('day').isBefore(today))
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate)); // newest first
  });

  // Featured events
  eleventyConfig.addCollection("featuredEvents", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.featured === true)
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  // Featured posts
  eleventyConfig.addCollection("featuredPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/posts/*.md")
      .filter(p => p.data.featured === true)
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate));
  });

  // Preview events - upcoming only (excluding featured)
  eleventyConfig.addCollection("previewEvents", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today) &&
        e.data.featured !== true // hide featured
      )
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (including featured)
  eleventyConfig.addCollection("previewEventsAll", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today)
      )
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - combined past and upcoming (excluding featured)
  eleventyConfig.addCollection("previewEventsCombined", function (collectionApi) {
    const today = dayjs().startOf('day');
    const allEvents = collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate && e.data.featured !== true);
    
    const upcoming = allEvents
      .filter(e => dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today))
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 2);
    
    const past = allEvents
      .filter(e => dayjs(e.data.eventDate).startOf('day').isBefore(today))
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 1);
    
    return [...upcoming, ...past];
  });

  // Preview events - combined past and upcoming (including featured)
  eleventyConfig.addCollection("previewEventsCombinedAll", function (collectionApi) {
    const today = dayjs().startOf('day');
    const allEvents = collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate);
    
    const upcoming = allEvents
      .filter(e => dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today))
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 2);
    
    const past = allEvents
      .filter(e => dayjs(e.data.eventDate).startOf('day').isBefore(today))
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 1);
    
    return [...upcoming, ...past];
  });

  // Preview events - past only (excluding featured)
  eleventyConfig.addCollection("previewPastEvents", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isBefore(today) &&
        e.data.featured !== true
      )
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - past only (including featured)
  eleventyConfig.addCollection("previewPastEventsAll", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isBefore(today)
      )
      .sort((a, b) => new Date(b.data.eventDate) - new Date(a.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (excluding featured) - duplicate for consistency
  eleventyConfig.addCollection("previewUpcomingEvents", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today) &&
        e.data.featured !== true
      )
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview events - upcoming only (including featured) - duplicate for consistency
  eleventyConfig.addCollection("previewUpcomingEventsAll", function (collectionApi) {
    const today = dayjs().startOf('day');
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).startOf('day').isSameOrAfter(today)
      )
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
      .slice(0, 3);
  });

  // Preview posts (excluding featured by default)
  eleventyConfig.addCollection("previewPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/posts/*.md")
      .filter(p => p.data.featured !== true) // hide featured
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate))
      .slice(0, 3);
  });

  // Preview posts (including featured)
  eleventyConfig.addCollection("previewPostsAll", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/posts/*.md")
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate))
      .slice(0, 3);
  });

  // Date formatting filter
  eleventyConfig.addFilter("formatDate", function (dateInput, format = 'dddd, Do MMMM YYYY') {
    if (!dateInput) return '';
    const parsed = dayjs(dateInput);
    return parsed.isValid() ? parsed.format(format) : String(dateInput);
  });

  // Concat filter for Nunjucks
  eleventyConfig.addFilter("concat", function (arr1, arr2) {
    if (!Array.isArray(arr1)) arr1 = [];
    if (!Array.isArray(arr2)) arr2 = [];
    return arr1.concat(arr2);
  });

  // JSON stringify filter
  eleventyConfig.addFilter("jsonify", function(value) {
    return JSON.stringify(value);
  });


  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};