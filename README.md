<a id="readme-top"></a>

[![Node][Node.js]][Node-url]
[![NestJS][NestJS]][NestJS-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![License: MIT][license-shield]][license-url]

<br />
<div align="center">
  <h3 align="center">Autonoma</h3>

  <p align="center">
    AI-powered content pipeline that researches trends, drafts posts, edits them, and optimizes for SEO — fully automated.
    <br />
    <a href="https://github.com/GabrielLacerda000/autonoma"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/GabrielLacerda000/autonoma/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/GabrielLacerda000/autonoma/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



## About The Project

Autonoma is a backend service that automates social media content creation end-to-end. You define a project with a niche and target audience, trigger the pipeline, and the system handles the rest:

1. **Trend Research** — an AI agent identifies the top trending topics for your niche
2. **Draft Generation** — a writer agent produces a full post for each trend
3. **Editing** — an editor agent refines the draft for clarity and tone
4. **SEO Optimization** — a final agent adds keywords and hashtags for maximum reach

Each stage is processed asynchronously via a BullMQ job queue, with all versions persisted to PostgreSQL so you have a full audit trail from draft to final post.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Built With

* [![NestJS][NestJS]][NestJS-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![Redis][Redis]][Redis-url]
* [![Google Gemini][Gemini]][Gemini-url]

**Also uses:** Drizzle ORM · BullMQ · Vercel AI SDK · Zod

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or connection string to a remote instance)
- Redis running on `localhost:6379`
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/GabrielLacerda000/autonoma.git
   cd autonoma
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Create a `.env` file at the project root
   ```env
   DATABASE_URL=postgresql://postgres:admin@localhost:5432/autonoma
   GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
   ```

4. Set up the database
   ```sh
   npm run db:generate
   npm run db:push
   ```

5. Start the development server
   ```sh
   npm run start:dev
   ```

The HTTP server starts on `http://localhost:3000` and the BullMQ worker starts automatically alongside it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Usage

### 1. Create a project

```http
POST /projects
Content-Type: application/json

{
  "name": "Tech Blog",
  "niche": "Artificial Intelligence",
  "targetAudience": "software developers",
  "toneOfVoice": "technical and concise"
}
```

### 2. Trigger the content pipeline

```http
POST /pipeline/:projectId
```

This enqueues a BullMQ flow. The worker processes it asynchronously — trend research → draft → edit → SEO optimization.

### 3. Retrieve results

```http
# All trends identified for the project
GET /projects/:id/trends

# Posts filtered by stage (draft | edited | seo)
GET /projects/:id/posts?stage=seo
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Architecture

The system is split into four NestJS modules:

| Module | Responsibility |
|---|---|
| **QueueModule** | Global BullMQ setup — `QueueService` exposes `startContentPipeline()` |
| **ContentPipelineModule** | BullMQ worker + handler registry that dispatches jobs to the right handler |
| **ProjectsModule** | REST API for project CRUD and reading trends/posts |
| **AI Agents** | Four independent agents (TrendResearcher, Writer, Editor, SeoOptimizer) each wrapping a Gemini call |

**Job flow inside BullMQ:**

```
generate_content_for_project       ← completion job (parent)
  └── generate_trends              ← runs first; fans out per trend
        └── post_pipeline_N
              └── optimize_seo    ← 3rd
                    └── edit      ← 2nd
                          └── draft ← 1st
```

Posts are versioned in the database — every transformation stage (draft → edited → seo) is stored as a separate row, preserving the full history.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Roadmap

- [x] BullMQ pipeline with hierarchical job flow
- [x] TrendResearcherAgent (Gemini + structured output)
- [x] WriterAgent, EditorAgent, SeoOptimizerAgent
- [x] Drizzle ORM schema (projects, trends, posts)
- [x] REST API for projects and posts
- [ ] Authentication and multi-tenant support
- [ ] WebSocket endpoint for real-time pipeline progress
- [ ] Scheduled automatic pipeline runs
- [ ] Dashboard UI

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

Gabriel Lacerda — gabrielglacerda000@gmail.com

Project: [https://github.com/GabrielLacerda000/autonoma](https://github.com/GabrielLacerda000/autonoma)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge
[license-url]: https://github.com/GabrielLacerda000/autonoma/blob/main/LICENSE

[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/

[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://nestjs.com/

[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/

[PostgreSQL]: https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/

[Redis]: https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/

[Gemini]: https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white
[Gemini-url]: https://deepmind.google/technologies/gemini/
