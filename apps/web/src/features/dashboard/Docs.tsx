import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Create Singularity App Documentation</h1>
          <Button variant="outline" asChild>
            <a href="https://github.com/devxoshakya/singularity-app" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
              <div className="space-y-4">
                <div className="font-medium">Getting Started</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#introduction" className="text-muted-foreground hover:text-foreground">
                      Introduction
                    </a>
                  </li>
                  <li>
                    <a href="#quick-start" className="text-muted-foreground hover:text-foreground">
                      Quick Start
                    </a>
                  </li>
                  <li>
                    <a href="#usage" className="text-muted-foreground hover:text-foreground">
                      Usage
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="text-muted-foreground hover:text-foreground">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#requirements" className="text-muted-foreground hover:text-foreground">
                      Requirements
                    </a>
                  </li>
                </ul>
              </div>
            </ScrollArea>
          </aside>
          <div className="space-y-8">
            <section id="introduction">
              <h2 className="text-3xl font-bold tracking-tight">Introduction</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Create Singularity App is a lightning-fast CLI tool to create result extraction projects using Bun and TypeScript.
              </p>
            </section>
            <section id="quick-start">
              <h2 className="text-3xl font-bold tracking-tight">Quick Start</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                To initialize a new project, run the following command:
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4">
                <code className="font-mono text-sm text-foreground">bunx singularity-app@latest init</code>
              </pre>
            </section>
            <section id="usage">
              <h2 className="text-3xl font-bold tracking-tight">Usage</h2>
              <ol className="mt-4 space-y-4 text-lg text-muted-foreground">
                <li>Navigate to your project directory:</li>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="font-mono text-sm text-foreground">cd your-project-name</code>
                </pre>
                <li>Install dependencies:</li>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="font-mono text-sm text-foreground">bun install</code>
                </pre>
                <li>
                  Add roll numbers to
                  <code>src/rollNumbers.txt</code>
                  {' '}
                  (one per line):
                </li>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="font-mono text-sm text-foreground">{`2300680100104\n2300680100105\n2300680100106`}</code>
                </pre>
                <li>
                  Add your API key to the
                  <code>.env</code>
                  {' '}
                  file:
                </li>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="font-mono text-sm text-foreground">API_KEY=your-api-key-here</code>
                </pre>
                <li>Run the extraction process:</li>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                  <code className="font-mono text-sm text-foreground">bun send</code>
                </pre>
              </ol>
            </section>
            <section id="features">
              <h2 className="text-3xl font-bold tracking-tight">Features</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-lg text-muted-foreground">
                <li>🚄 Fast execution powered by Bun</li>
                <li>📊 Export results in JSON and CSV formats</li>
                <li>📝 Detailed execution logs</li>
                <li>🔄 Type-safe development with TypeScript</li>
                <li>🎯 Simple and intuitive setup</li>
                <li>🔑 Secure API key management</li>
              </ul>
            </section>
            <section id="requirements">
              <h2 className="text-3xl font-bold tracking-tight">Requirements</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ensure you have
                {' '}
                <a href="https://bun.sh" target="_blank" className="underline">Bun</a>
                {' '}
                (version 1.0 or later) installed on your system.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
