/**
 * Renders the site's Open Graph and X preview cards with Takumi.
 *
 * Every content page and section gets a 1200x630 PNG under static/og/. The
 * generated files are build artifacts, not source. The mono theme points its
 * social metadata at og/<page.path>.png and falls back to og/default.png.
 */

import React from 'react'
import { readFile, readdir, mkdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseToml } from 'smol-toml'
import { render } from 'takumi-js'
import { Renderer } from 'takumi-js/node'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CONTENT = path.join(ROOT, 'content')
const STATIC = path.join(ROOT, 'static')
const THEME = path.join(ROOT, 'themes', 'mono')
const OUTPUT = path.join(STATIC, 'og')

const WIDTH = 1200
const HEIGHT = 630

const colors = {
  chip: '#fff3a8',
  desk: '#ececec',
  faint: '#c8c8c8',
  ink: '#000000',
  muted: '#4d4d4d',
  paper: '#ffffff',
  shade: '#a3a3a3',
}

const fonts = [
  { file: 'ibm-plex-mono-latin-400-normal.woff2', weight: 400 },
  { file: 'ibm-plex-mono-latin-500-normal.woff2', weight: 500 },
  { file: 'ibm-plex-mono-latin-700-normal.woff2', weight: 700 },
]

const contentWidth = WIDTH - 2 * 44 - 2 * 56

function dataUrl(mime: string, bytes: Uint8Array) {
  return `data:${mime};base64,${Buffer.from(bytes).toString('base64')}`
}

function splitFrontMatter(source: string) {
  if (!source.startsWith('+++\n')) return { data: {}, body: source }

  const end = source.indexOf('\n+++\n', 4)
  if (end === -1) throw new Error('unterminated TOML front matter')

  return {
    data: parseToml(source.slice(4, end + 1)),
    body: source.slice(end + 5),
  }
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(directory, entry.name)
      if (entry.isDirectory()) return markdownFiles(full)
      return entry.isFile() && entry.name.endsWith('.md') ? [full] : []
    }),
  )
  return files.flat().sort()
}

function cleanKey(value: string) {
  return value
    .replaceAll('\\', '/')
    .split('/')
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join('/')
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function slugPath(value: string) {
  return cleanKey(value)
    .split('/')
    .map(slugify)
    .filter(Boolean)
    .join('/')
}

function keyFor(relative: string, data: Record<string, any>) {
  const directory = path.posix.dirname(relative)
  const base = path.posix.basename(relative)
  const directoryKey = directory === '.' ? '' : slugPath(directory)
  let key: string

  if (base === '_index.md' || base === 'index.md') {
    key = directoryKey || 'home'
  } else {
    const filename = slugify(base.slice(0, -3))
    key = directoryKey ? `${directoryKey}/${filename}` : filename
  }

  if (typeof data.path === 'string' && data.path.trim()) {
    key = cleanKey(data.path)
  }

  if (typeof data.slug === 'string' && data.slug.trim() && base !== '_index.md') {
    const parent = path.posix.dirname(key)
    key = cleanKey(parent === '.' ? data.slug : `${parent}/${data.slug}`)
  }

  return key || 'home'
}

function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/{%\s*(?:raw|endraw)\s*%}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/^[ \t]*[-*+]\s+/gm, '')
    .replace(/^[ \t]*\d+\.\s+/gm, '')
    .replace(/[*_~`>#]/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function summary(body: string) {
  const intro = body.split('<!-- more -->')[0]
  const paragraph = intro
    .split(/\n{2,}/)
    .map(plainText)
    .find((value) => value.length > 0)

  return (paragraph || '').slice(0, 240).trim()
}

function formatDate(value: unknown) {
  if (value instanceof Date) {
    const year = value.getUTCFullYear()
    const month = String(value.getUTCMonth() + 1).padStart(2, '0')
    const day = String(value.getUTCDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  if (typeof value === 'string' && value.length >= 10) return value.slice(0, 10).replaceAll('-', '.')
  return ''
}

function titleFor(data: Record<string, any>, relative: string) {
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim()
  return path.posix.basename(relative, '.md').replaceAll('-', ' ')
}

function descriptionFor(data: Record<string, any>, body: string, fallback: string) {
  const extra = data.extra && typeof data.extra === 'object' ? data.extra : {}
  const candidates = [data.description, extra.lead, summary(body), fallback]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return plainText(candidate).slice(0, 260).trim()
    }
  }

  return fallback
}

function labelFor(key: string, sections: Map<string, string>) {
  if (key === 'home') return 'about'
  if (key === 'posts') return 'Blog'
  if (key.startsWith('posts/')) return 'Posts'
  if (key === 'projects') return 'Projects'

  if (key.startsWith('projects/')) {
    const parts = key.split('/')
    const projectKey = `projects/${parts[1]}`
    if (key === projectKey) return 'Projects'

    const project = sections.get(projectKey)
    if (project) return project
  }

  let parent = key.split('/').slice(0, -1).join('/')
  while (parent) {
    const title = sections.get(parent)
    if (title) return title
    parent = parent.split('/').slice(0, -1).join('/')
  }

  return 'Zwit'
}

function Masthead(props: { label?: string | undefined; logo: string }) {
  const { label, logo } = props

  return (
    <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 24 }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
        <div
          style={{
            alignItems: 'center',
            backgroundColor: colors.paper,
            border: `2px solid ${colors.ink}`,
            boxShadow: `4px 4px 0 ${colors.shade}`,
            display: 'flex',
            height: 64,
            justifyContent: 'center',
            width: 64,
          }}
        >
          <img height={42} src={logo} width={42} />
        </div>
        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Zwit</span>
      </div>
      {label ? (
        <span
          style={{
            backgroundColor: colors.chip,
            border: `3px solid ${colors.ink}`,
            boxShadow: `4px 4px 0 ${colors.ink}`,
            fontSize: 24,
            fontWeight: 500,
            padding: '6px 16px',
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}

function Card(props: {
  background: string
  description: string
  footer: string
  label?: string | undefined
  logo: string
  title: string
}) {
  const { background, description, footer, label, logo, title } = props
  const fontSize = Math.max(56, Math.min(88, Math.floor(contentWidth / (0.6 * Math.max(title.length, 1)))))

  return (
    <div
      style={{
        backgroundColor: colors.desk,
        backgroundImage: `url("${background}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        height: '100%',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(236, 236, 236, 0.62)',
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />
      <div style={{ display: 'flex', flex: 1, padding: 44, position: 'relative' }}>
        <div
          style={{
            backgroundColor: colors.paper,
            border: `1px solid ${colors.faint}`,
            boxShadow: `4px 4px 0 ${colors.shade}`,
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 56,
          }}
        >
          <Masthead label={label} logo={logo} />

          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 20,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize,
                fontWeight: 700,
                letterSpacing: -2,
                lineClamp: 2,
                lineHeight: 1.05,
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: colors.muted,
                fontSize: 30,
                lineClamp: 3,
                lineHeight: 1.35,
                textOverflow: 'ellipsis',
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              borderTop: `3px dotted ${colors.ink}`,
              color: colors.muted,
              display: 'flex',
              fontSize: 22,
              fontWeight: 500,
              justifyContent: 'space-between',
              paddingTop: 18,
            }}
          >
            <span>zwit.link</span>
            <span>{footer}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

async function loadRenderer() {
  const renderer = new Renderer()

  for (const font of fonts) {
    const file = path.join(THEME, 'static', 'fonts', font.file)
    if (!existsSync(file)) throw new Error(`missing font: ${file}`)
    await renderer.registerFont({
      data: await readFile(file),
      name: 'IBM Plex Mono',
      style: 'normal',
      weight: font.weight,
    })
  }

  return renderer
}

async function main() {
  const configSource = await readFile(path.join(ROOT, 'config.toml'), 'utf8')
  const config = parseToml(configSource) as Record<string, any>
  const siteTitle = String(config.title || 'Zwit')
  const siteDescription = String(config.description || '')

  const files = await markdownFiles(CONTENT)
  const entries = []

  for (const file of files) {
    const relative = path.relative(CONTENT, file).split(path.sep).join('/')
    const source = await readFile(file, 'utf8')
    const { data, body } = splitFrontMatter(source)
    if (data.draft === true) continue

    const key = keyFor(relative, data)
    const isSection = path.posix.basename(relative) === '_index.md'
    entries.push({
      body,
      data,
      isSection,
      key,
      relative,
      title: titleFor(data, relative),
    })
  }

  const sections = new Map<string, string>()
  for (const entry of entries) {
    if (entry.isSection) sections.set(entry.key, entry.title)
  }

  const logo = dataUrl('image/svg+xml', await readFile(path.join(STATIC, 'logo', 'orbital-D-icon.svg')))
  const background = dataUrl('image/jpeg', await readFile(path.join(STATIC, 'bg.jpg')))
  const renderer = await loadRenderer()

  await rm(OUTPUT, { force: true, recursive: true })
  await mkdir(OUTPUT, { recursive: true })

  const renderCard = async (card: {
    description: string
    footer: string
    key: string
    label?: string | undefined
    title: string
  }) => {
    const element = (
      <Card
        background={background}
        description={card.description}
        footer={card.footer}
        label={card.label}
        logo={logo}
        title={card.title}
      />
    )
    const png = await render(element, {
      format: 'png',
      height: HEIGHT,
      renderer,
      width: WIDTH,
    })
    const output = path.join(OUTPUT, `${card.key}.png`)
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, png)
  }

  for (const entry of entries) {
    const description = descriptionFor(entry.data, entry.body, siteDescription)
    const date = formatDate(entry.data.date)
    const footer = entry.key === 'home' ? 'home' : date || `/${entry.key}/`
    const label = labelFor(entry.key, sections)

    await renderCard({
      description,
      footer,
      key: entry.key,
      label,
      title: entry.title,
    })
  }

  await renderCard({
    description: siteDescription,
    footer: 'site',
    key: 'default',
    title: siteTitle,
  })

  console.log(`social images: wrote ${entries.length + 1} cards to ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
