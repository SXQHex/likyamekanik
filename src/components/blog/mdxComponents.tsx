"use client";

import type { ComponentProps, ElementType } from "react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import Accordion from "./Accordion";
import DataTable from "./DataTable";
import InlineMath from "./InlineMath";

const Mermaid = dynamic(() => import("./Mermaid"), {
  ssr: false,
  loading: () => (
    <div className="my-6 h-32 w-full animate-pulse rounded-xl bg-muted/20" />
  ),
});

import SpecTable from "./SpecTable";
import FormulaBlock from "./FormulaBlock";
import UnitConverter from "./UnitConverter";
import Callout from './Callout';
import Steps from './Steps';
import ImageCaption from './ImageCaption';
import Tabs from './Tabs';
import DownloadCard from './DownloadCard';

// Missing components from the newly generated blog posts
const Hero = ({ title, description }: any) => (
  <div className="hero bg-muted p-6 rounded-lg mb-6">
    {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
    {description && <p className="text-lg text-muted-foreground">{description}</p>}
  </div>
);

const Section = ({ title, children }: any) => (
  <section className="my-8">
    {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
    {children}
  </section>
);

const RegulationBox = ({ title, article, children }: any) => (
  <div className="border-l-4 border-primary bg-primary/10 p-4 my-6 rounded-r-lg">
    <div className="font-semibold mb-1">{title}</div>
    {article && <div className="text-sm text-primary mb-2">{article}</div>}
    <div>{children}</div>
  </div>
);

const FireFlowDiagram = (props: any) => (
  <div className="p-4 border border-dashed border-primary text-center my-4 text-muted-foreground bg-muted/50 rounded-lg">
    Fire Flow Diagram Visual Placeholder
  </div>
);

export const mdxComponents = {
  Image,

  Accordion,
  Callout,
  DataTable,
  DownloadCard,
  FormulaBlock,
  ImageCaption,
  InlineMath,
  Mermaid,
  SpecTable,
  Steps,
  Tabs,
  UnitConverter,

  Hero,
  Section,
  RegulationBox,
  FireFlowDiagram,
  a: Link as ElementType<ComponentProps<typeof Link>>, // MDX içindeki linklerin Next-Intl uyumlu olması için
};