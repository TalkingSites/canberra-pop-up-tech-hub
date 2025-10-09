const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // All events (sorted by date ascending)
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/posts/*.md")
      .sort((a, b) => new Date(b.data.postDate) - new Date(a.data.postDate));
  });

  // Upcoming events
  eleventyConfig.addCollection("upcomingEvents", function (collectionApi) {
    const now = dayjs();
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate && dayjs(e.data.eventDate).isAfter(now))
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate));
  });

  // Past events
  eleventyConfig.addCollection("pastEvents", function (collectionApi) {
    const now = dayjs();
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e => e.data.eventDate && dayjs(e.data.eventDate).isBefore(now))
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

  // Preview events (excluding featured by default)
  eleventyConfig.addCollection("previewEvents", function (collectionApi) {
    const now = dayjs();
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).isAfter(now) &&
        e.data.featured !== true // hide featured
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

  // Preview events (including featured)
  eleventyConfig.addCollection("previewEventsAll", function (collectionApi) {
    const now = dayjs();
    return collectionApi.getFilteredByGlob("src/pages/events/*.md")
      .filter(e =>
        e.data.eventDate &&
        dayjs(e.data.eventDate).isAfter(now)
      )
      .sort((a, b) => new Date(a.data.eventDate) - new Date(b.data.eventDate))
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