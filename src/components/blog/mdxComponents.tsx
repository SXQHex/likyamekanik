import type { ComponentProps, ElementType } from "react";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import  Accordion  from "./Accordion";
import  FireFlowDiagram  from "./FireFlowDiagram";
import  RegulationBox  from "./RegulationBox";
import  DataTable  from "./DataTable";
import  Section  from "./Section";
import  InlineMath  from "./InlineMath";
import Hero from "./Hero";
// İleride ekleyeceğin her bileşeni buraya ekle

export const mdxComponents = {
  Image,
  Accordion,
  FireFlowDiagram,
  RegulationBox,
  DataTable,
  Section,
  Hero,
  InlineMath,
  a: Link as ElementType<ComponentProps<typeof Link>>, // MDX içindeki linklerin Next-Intl uyumlu olması için
//  h1: (props: any) => <h1 className="text-4xl font-black uppercase mb-6 mt-10 scroll-m-20" {...props} />,
//  h2: (props: any) => <h2 className="text-2xl font-black uppercase mb-4 mt-8 border-b pb-2 scroll-m-20" id={props.id} {...props} />,
//  h3: (props: any) => <h3 className="text-xl font-bold uppercase mb-3 mt-6 scroll-m-20" {...props} />,
};