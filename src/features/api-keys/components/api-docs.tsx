"use client";

import { Terminal } from "lucide-react";
import { CopyButton } from "@/components/molecules/copy-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Badge } from "@/components/atoms/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/atoms/table";

export function ApiDocs() {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://altseo.app";

    const curlExample = `curl -X POST ${baseUrl}/api/generate-alt-text \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "variant": "seo"
  }'`;

    const jsExample = `const response = await fetch('${baseUrl}/api/generate-alt-text', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    variant: 'seo' // 'default' | 'seo' | 'long' | 'accessibility'
  })
});

const data = await response.json();
console.log(data.altText);`;

    const pythonExample = `import requests

url = "${baseUrl}/api/generate-alt-text"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "imageUrl": "https://example.com/image.jpg",
    "variant": "seo"
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["altText"])`;

    return (
        <div className="slide-in-from-bottom-4 space-y-8 animate-in duration-500 delay-100 fade-in">
            <div className="space-y-4">
                <h2 className="font-bold text-2xl tracking-tight">API Documentation</h2>
                <p className="text-muted-foreground text-lg">
                    Integrate AI-powered alt text generation directly into your workflow.
                </p>
            </div>

            <div className="gap-6 grid md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Endpoint</CardTitle>
                        <CardDescription>Main generation endpoint</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 bg-muted p-3 border border-border/50 rounded-md font-mono text-sm">
                            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">POST</Badge>
                            <span className="text-foreground/90">{baseUrl}/api/generate-alt-text</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Authentication</CardTitle>
                        <CardDescription>Secure your requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-sm">
                                Include your API key in the Authorization header.
                            </p>
                            <div className="bg-muted p-3 border border-border/50 rounded-md font-mono text-foreground/90 text-sm">
                                Authorization: Bearer <span className="text-green-600 dark:text-green-400">altseo_...</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Request Parameters</CardTitle>
                    <CardDescription>JSON body parameters</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[200px]">Parameter</TableHead>
                                    <TableHead className="w-[100px]">Type</TableHead>
                                    <TableHead className="w-[100px]">Required</TableHead>
                                    <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-mono font-medium">imageUrl</TableCell>
                                    <TableCell className="text-muted-foreground">string</TableCell>
                                    <TableCell className="font-medium text-blue-600">Yes</TableCell>
                                    <TableCell className="text-muted-foreground">The full public URL of the image to process.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono font-medium">variant</TableCell>
                                    <TableCell className="text-muted-foreground">string</TableCell>
                                    <TableCell className="text-muted-foreground">No</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        The style of alt text. Options: <code className="bg-muted px-1 py-0.5 rounded text-xs">default</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">seo</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">long</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">accessibility</code>.
                                        <br />
                                        Defaults to <code className="bg-muted px-1 py-0.5 rounded text-xs">default</code>.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Code Examples</CardTitle>
                    <CardDescription>Ready-to-use snippets for your application</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="curl" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>

                        <TabsContent value="curl">
                            <div className="relative bg-stone-950 dark:bg-stone-900 border border-stone-800 rounded-md">
                                <pre className="p-4 overflow-x-auto font-mono text-stone-50 text-sm leading-relaxed">
                                    {curlExample}
                                </pre>
                                <div className="top-2 right-2 absolute">
                                    <CopyButton text={curlExample} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="js">
                            <div className="relative bg-stone-950 dark:bg-stone-900 border border-stone-800 rounded-md">
                                <pre className="p-4 overflow-x-auto font-mono text-stone-50 text-sm leading-relaxed">
                                    {jsExample}
                                </pre>
                                <div className="top-2 right-2 absolute">
                                    <CopyButton text={jsExample} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="python">
                            <div className="relative bg-stone-950 dark:bg-stone-900 border border-stone-800 rounded-md">
                                <pre className="p-4 overflow-x-auto font-mono text-stone-50 text-sm leading-relaxed">
                                    {pythonExample}
                                </pre>
                                <div className="top-2 right-2 absolute">
                                    <CopyButton text={pythonExample} />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/50 mt-1 p-2 rounded-lg h-fit">
                            <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">Need help?</h3>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                For questions about rate limits, enterprise usage, or integration support, please contact our implementation team.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
