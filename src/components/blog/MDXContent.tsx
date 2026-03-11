'use client';

import * as runtime from 'react/jsx-runtime'
import { mdxComponents } from './mdxComponents'

// Parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default
}

interface MDXProps {
    code: string
    components?: Record<string, React.ComponentType>
}

// MDXContent component for rendering Velite MDX output
export function MDXContent({ code, components }: MDXProps) {
    const Component = useMDXComponent(code)
    return <Component components={{ ...mdxComponents, ...components }} />
}
