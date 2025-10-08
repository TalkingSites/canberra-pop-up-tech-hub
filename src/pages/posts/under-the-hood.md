---
title: Under The Hood
description: Want to know how this website works, how to edit, customise, or use this template? Read more on this page!
permalink: /posts/under-the-hood/
postDate: 2025-09-30
author: starship-droid
---

Welcome to the technical guide for this website. This post explains what is used to make this website, how you can get started using this template, how to customise the look, and how to edit the content and add your own content!

This website uses:
- [Eleventy (11ty)](https://www.11ty.dev/docs/)
- [Nunjucks](https://www.11ty.dev/docs/languages/nunjucks/)
- [Bootstrap](https://getbootstrap.com/)
- [Pagefind](https://www.npmjs.com/package/pagefind)
- [Github](https://github.com/TalkingSites/web-template)
- [Netlify](https://www.netlify.com/)

## How It All Works Together

```
┌─────────────────────────────────────────────────────────┐
│                      YOUR CONTENT                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Events     │  │    Posts     │  │     Pages     │  │
│  │   (.MD)      │  │    (.MD)     │  │ (.MD or .njk) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘  │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                           ↓                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│                        ELEVENTY (.eleventy.js)                 │
│  Takes your content and builds it into a complete website      │
│  • Creates collections (events, posts, featured items)         │
│  • Sorts content by date                                       │
│  • Adds date formatting filters                                │
│  • Copies assets (images, CSS, JS)                             │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NUNJUCKS TEMPLATES (.njk)                    │
│  Defines how your content looks and is structured               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         BOOTSTRAP                               │
│  Provides styling and responsive design                         │
│  • Grid system for layouts                                      │
│  • Pre-built components (cards, buttons, modals)                │
│  • Mobile-responsive navigation                                 │
│  • Utility classes for spacing and colors                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BUILT SITE (_site/)                        │
│  Final HTML files ready to deploy                               │
│  • Static HTML pages                                            │
│  • Optimized CSS and JavaScript                                 │
│  • Search index (Pagefind)                                      │
│  • All images and assets                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                           GITHUB                                │
│  Stores your code and tracks changes                            │
│  This website uses Github, you may choose another git provider  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                          NETLIFY                                │
│  Hosts your website and makes it live on the internet           │
│  • Automatic builds when you push to Github                     │
│  • Handles contact forms (no backend needed!)                   │
│  • Provides HTTPS and CDN                                       │
│  • Live URL for visitors to access your site                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    🌐 LIVE WEBSITE 🌐
                Your site is now online!
```

# Getting Started

## Quick Guide
```
┌───────────────┐      ┌─────────────────┐      ┌─────────────┐      
│  1.           │      │  2.             │      │  3.         │      ┌───────────────┐
│  Fork Github  │  →   │  Customise &    │  →   │  Deploy on  │  →   │ Site is Live! │
│  Repository   │      │  Write Content  │      │  Netlify    │      └───────────────┘
└───────────────┘      └─────────────────┘      └─────────────┘      
```

## Prerequisites
Basic familiarity with Git, Markdown, and running terminal commands is needed.

Note: This guide uses GNU/Linux Commands. You will need to look up the commands equivalent to your OS.


## Set up locally
After you have forked the repository, clone and open it on your IDE (such as VSCode).

### Install Node
If you do not have Node installed, do so using the following command:
```
sudo apt install nodejs npm
```

### Install 11ty
If you have node installed, run the following command to get 11ty:
```
npm install @11ty/eleventy
```
### Run 11ty
Once 11ty is installed successfully, run the following command to start the website. 
```
npx @11ty/eleventy --serve
```
If the site is running successfully, you should see "Server at http://localhost:8080/" (sometimes it is a number different to 8080).

To open the website, click on http://localhost:8080/ or paste it into your web browser.

### Install Pagefind
You will also need to run the following command to get the Search feature working as well:

```
npm install pagefind
```

Note: the "Search" feature is referring to the Search button on the top right of the navigation bar (navbar).


## 2. Writing Content
This website template aims to reduce the need to write HTML and instead the majority of content can be made with markdown (MD) files.

### Properties
On each MD page, there are properties at the very top. Below are properties that all pages use:

```
---
title: A Short Clear Page Name
description: Add more information on the page here. This is also going to be searchable.
permalink: "/link-to-page/"
---
```
### Title and Description
The title and description effect the following:
- Search feature - the title and description is what the search feature matches against
- Meta title and description - this is what search engines such as google search against

### Permalink
The permalink property is the url of the page. For example, if you set the permalink to "/link-to-page/" then to go to the page you would go to "localhost:8080/link-to-page"

If you are getting permalink errors when running the site, make sure added the slash at the end and that no files use the same permalink.

### Pages
Pages are stored in "/src/pages"

To make a new page, simply add a new file with the file extension ".MD" in the pages folder.

Then, add the properties (title, description and permalink). 

Underneath the properties, you can start writing your content in MD format.

#### Finding the page
By default, all pages can be found via the Search if you have added a title and description property.

To add a link to your page on other pages, use the permalink using MD format.

For example, the page "/src/pages/about.MD" with the permalink "/about/" can be put into other pages like this:

```
[About](/about/)
```
And then it will show on the page like this: [About](/about/)

#### Advanced Pages
You can add HTML, CSS, JS and Nunjucks to MD pages but if you are finding that the majority of the page is not MD then it is suggested to make it a .njk page instead to avoid confusion.

Note that you will still need to add the properties to nunjucks pages.

### Events


### Posts

### Search



## Customisation

### Colors

### Site Details

### Navbar & Footer

### Home Page
The default home page layout is made to display a welcome hero, featured events and posts, the upcoming events preview and the recent posts preview.  


### Layouts
Layouts are.....
The layouts can be found in /src/_includes/layouts
This web template comes with 3 different layouts:

### Partials

**base.njk**

## 3. Deploy




# Copy this Help File
Click on the button below to copy this whole help file so you can paste it into AI and start asking questions :)

<button id="copyHelp" class="btn btn-primary">Copy this Help File</button>



This file was written by a human with the exception of the "How it All Works Together" ASCII guide which was made using Claude.AI


<script src="/assets/js/copyHelpFile.js"></script>