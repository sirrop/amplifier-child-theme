export function removeHTMLTags(html: string): string {
    return html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
}