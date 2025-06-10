'use client';

import { Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// In a real-world scenario, this function would be on the server-side
const generateApiKey = (length: number = 32) => {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export default function APIComponent() {
  const [duration, setDuration] = useState<'monthly' | 'yearly'>('monthly');
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleGenerate = () => {
    const newApiKey = generateApiKey();
    setApiKey(newApiKey);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Generate API Key</CardTitle>
        <CardDescription>Choose a duration and generate your API key.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 md:flex-row">
        <div className="w-full space-y-4 md:w-1/3">
          <div className="space-y-1">
            <Label htmlFor="duration">Duration</Label>
            <Select onValueChange={(value: 'monthly' | 'yearly') => setDuration(value)}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} className="w-full">
            <RefreshCw className="mr-2 size-4" />
            {' '}
            Generate API Key
          </Button>
          <p className="text-sm text-muted-foreground">
            Your
            {' '}
            {duration}
            {' '}
            API key will be valid for
            {' '}
            {duration === 'monthly' ? '30 days' : '1 year'}
            .
          </p>
        </div>
        {apiKey !== null && (
          <div className="w-full space-y-4 md:w-2/3">
            <div className="space-y-1">
              <Label htmlFor="api-key">Your API Key</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  value={apiKey}
                  readOnly
                  className="grow font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="ml-2"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This is your unique API key. Keep it secure and do not share it publicly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
