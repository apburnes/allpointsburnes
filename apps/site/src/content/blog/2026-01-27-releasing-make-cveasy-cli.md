---
title: "Releasing make-cveasy: A CLI to rethink the way you manage your resume"
description: "Building a command-line tool to manage resumes with git, natural language processing, and LLMs. Easing the pain of maintaining a resume and its versions while rethinking the way you structure professional experience."
pubDate: "Jan 27 2026"
tags:
  - python
  - cli
  - ai
  - resume
  - productivity
---

Let's be honest: job hunting is already soul-crushing enough without having to maintain umpteenth versions of your resume. You know the drill. You spend an hour tweaking your resume for a specific role, save it as `resume-company-name-final-v2-ACTUALLY-FINAL.pdf`, and then three weeks later you can't remember which version you sent where or why you emphasized "synergy" so heavily in one of them.

I got tired of this chaos, so I built [make-cveasy](https://github.com/apburnes/make-cveasy). A Python CLI that lets you maintain one source of truth for your professional experience and automatically generate tailored resumes using keyword matching and AI. Think of it as git for your career, but with fewer merge conflicts and more employment opportunities.

## The Problem (Or: Why My Downloads Folder Was a Crime Scene)

We've all been there. You start with one pristine resume. Then you apply to a few jobs and suddenly you're staring at:

- `resume-v1.pdf`
- `resume-software-engineer.pdf`
- `resume-data-scientist-v2.pdf`
- `resume-FINAL.pdf`
- `resume-FINAL-FINAL.pdf`
- `resume-ok-THIS-one.pdf`

Each version has slight variations—emphasizing different skills, reordering experiences, or tweaking that one bullet point because the job posting mentioned "cross-functional collaboration" and you wanted to prove you can, in fact, collaborate cross-functionally.

This approach has real problems beyond making your file system look like a cry for help:

- **Version control nightmare**: Which version went to which company? Did you send the one with the typo? (Spoiler: yes, you did.)
- **Duplication**: The same experience description lives in twelve places, so when you want to update it, you get to play a fun game of find-and-replace across your entire career
- **Inconsistency**: Over time, versions drift apart until you're not even sure which one represents the "real" you anymore
- **Time sink**: Manually customizing resumes for each application is mind-numbing work that makes you question your life choices

The traditional approach—one master resume, endless manual copies—doesn't scale. And honestly, you have better things to do with your time, like doom-scrolling job boards.

## Try It Out

If any of this resonates with you (and I suspect it does), make-cveasy is available on [GitHub](https://github.com/apburnes/make-cveasy) and can be installed via pip:

```bash
pip install cveasy
```

The repository includes documentation, examples, and a quick start guide. If you're tired of playing resume roulette, give it a shot and let me know what you think.

## Why I Built It (Besides the Obvious Frustration)

I'm a developer. When I have a problem that involves repetitive manual work and inconsistent data, my brain immediately goes to "surely there's a way to automate this." And when there isn't? Well, that's how side projects are born.

I wanted a system that treats resume data like code: version-controlled, modular, and composable. Instead of editing one giant document and praying I didn't break the formatting, I wanted to manage discrete pieces of information—skills, experiences, war stories from past projects—and let AI assemble them into tailored resumes.

The vision was straightforward:

1. **Single source of truth**: Store all your resume data (skills, experiences, stories, projects, education) as structured markdown files. Change it once, and it updates everywhere.
2. **AI-powered customization**: Let AI generate resumes tailored to specific job descriptions, because it turns out robots are pretty good at matching keywords
3. **Quality checking**: Automatically analyze how well your resume matches a job description before you hit send and hope for the best
4. **Iterative improvement**: Generate, check, tweak, regenerate—a feedback loop that doesn't require you to manually copy-paste between documents

This approach gives you version control (finally, meaningful commit messages like "added that kubernetes cert I forgot about"), modularity (each experience in its own file), and automation (AI does the tedious customization). You maintain your data once, and the tool handles the rest.

## Building with AI Pair Programming (Yes, I Used AI to Build an AI Tool)

Here's the meta part: I used AI pair programming to build a tool that uses AI. It's AI all the way down. Tools like Cursor and Claude Code genuinely transformed how I approached this project—not by writing everything for me, but by handling the parts that make me want to flip a table.

### Architecture and Structure

One thing AI is surprisingly good at is helping you think through architecture before you've written a single line of code. Instead of my usual approach (build something, realize it's wrong, refactor while crying), I could describe what I wanted and get immediate feedback on structure.

This led to a clean service-oriented architecture:

- **ResumeService**: Handles resume generation logic
- **ApplicationService**: Manages job applications and job description scraping
- **CheckService**: Performs quality analysis
- **DataService**: CRUD operations for resume data
- **ImportService**: Parses existing resumes using AI

Is it over-engineered for a CLI tool? Maybe. But it's also maintainable, and Future Me appreciates that.

### Implementation Speed

AI dramatically accelerated the boring parts. When building the job description scraper, I could describe what I needed ("scrape job description from URL, handle different site structures, don't break when LinkedIn does something weird") and get working code quickly. The AI handled boilerplate, error handling patterns, and common edge cases—the stuff that's not hard, just tedious.

Same story with the AI provider abstraction (supporting OpenAI, Anthropic, and OpenRouter). Instead of writing three nearly-identical adapters by hand, AI generated the patterns and I refined the details.

### The Balance

I want to be clear: AI pair programming isn't about outsourcing your brain. I still made all the architectural decisions, defined the user experience, and debugged the weird edge cases at 11pm. AI handled the repetitive parts—CLI argument parsing, file I/O patterns, error handling boilerplate—so I could focus on the parts that actually required thinking.

The result? A fully-featured CLI tool built faster than it would have been otherwise, with decent code quality and test coverage. And I got to keep my sanity, which is arguably the most important metric.

## How It Works: The Generate Command

The `generate` command is the heart of make-cveasy. It takes all your structured resume data and uses AI to create a customized resume—either a general-purpose version or one tailored to a specific job application.

Here's what happens under the hood: the tool loads all your resume data from the project structure (skills, experiences, success stories, projects, education, links—basically your entire professional life in markdown form). If you specify an application ID, it pulls in the corresponding job description and tells the AI to customize the resume, emphasizing the experiences and skills that match what the job is asking for.

The AI gets:

- Your complete resume data (the raw ingredients)
- The job description (what we're optimizing for)
- Instructions to create something professional that doesn't sound like a robot wrote it
- Guidance on what to emphasize and what to downplay

The output is a markdown file, which you can then export to PDF or Word. No more wrestling with formatting in Google Docs at 2am.

## How It Works: Check Command

The `check` command analyzes how well your resume matches a job description. It performs multiple types of analysis and generates a detailed report with recommendations.

The check process performs three types of analysis:

1. **Keyword Matching**: Extracts important keywords and phrases from the job description and checks which appear in your resume. This helps identify missing terminology or industry-specific language.

2. **Skills Matching**: Compares the skills mentioned in the job description against your resume's skills. It identifies which required skills you have, which are missing, and which you have but didn't emphasize.

3. **LLM Comparison**: Uses AI to perform a deeper analysis, comparing your resume against the job description. The AI identifies strengths, weaknesses, and specific recommendations for improvement.

The check report includes:

- Keyword coverage statistics
- Skills match analysis
- AI-generated recommendations
- Specific suggestions for improving alignment

After reviewing the check report, you can run `generate --update` to regenerate the resume with improvements based on the recommendations.

## Key Features

Beyond generate and check, make-cveasy includes several other features:

- **Project-based structure**: All resume data is stored as markdown files in a git-friendly structure, making version control natural
- **Import from existing resumes**: Use AI to parse existing PDF or DOCX resumes and automatically extract skills, experiences, and other data
- **Job description scraping**: Automatically extract job descriptions from URLs when creating new applications
- **Export capabilities**: Convert markdown resumes to PDF or Word documents
- **Cover letter generation**: Generate personalized cover letters for job applications
- **Token usage tracking**: Monitor AI API usage with detailed metrics

## The Iterative Workflow

The real power comes from the iterative workflow:

1. **Generate** a customized resume for a job application
2. **Check** the resume against the job description
3. Review the check report and identify improvements
4. **Generate --update** to regenerate with improvements
5. Repeat until satisfied
6. **Export** to PDF or Word for submission

This feedback loop helps you create highly tailored resumes that closely match job requirements, improving your chances of getting noticed by ATS systems and hiring managers.

## Wrapping Up

Building make-cveasy was a fun project that solved a real problem I was facing. The combination of structured data, version control, and AI made something that's genuinely useful—not just a toy project. If you're in the job market or just want a better way to manage your professional story, give it a shot. I'm actively using it myself and iterating based on real-world usage, so expect updates as I discover what works and what doesn't. Feedback and contributions are always welcome, and if you build something cool with it, I'd love to hear about it.
