'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogSearchProps {
  placeholder?: string;
  defaultValue?: string;
}

export function BlogSearch({ placeholder = 'Search...', defaultValue }: BlogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const newQuery: Record<string, string> = {};
    params.forEach((v, k) => {
      newQuery[k] = v;
    });

    if (Object.keys(newQuery).length > 0) {
      router.push({
        pathname: '/blog',
        query: newQuery as any
      });
    } else {
      router.push('/blog');
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
