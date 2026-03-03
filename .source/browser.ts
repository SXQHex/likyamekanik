// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  posts: create.doc("posts", {"en/fire-cabinet-systems-and-maintenance.mdx": () => import("../content/blog/en/fire-cabinet-systems-and-maintenance.mdx?collection=posts"), "en/fire-hose-selection-and-standards.mdx": () => import("../content/blog/en/fire-hose-selection-and-standards.mdx?collection=posts"), "en/fire-installation-design-principles-in-buildings.mdx": () => import("../content/blog/en/fire-installation-design-principles-in-buildings.mdx?collection=posts"), "en/heat-pump-technology-and-energy-conversion-engineering-guide-and-investment-analysis.mdx": () => import("../content/blog/en/heat-pump-technology-and-energy-conversion-engineering-guide-and-investment-analysis.mdx?collection=posts"), "tr/isi-pompasi-nedir.mdx": () => import("../content/blog/tr/isi-pompasi-nedir.mdx?collection=posts"), "tr/yangin-dolabi-bakimi.mdx": () => import("../content/blog/tr/yangin-dolabi-bakimi.mdx?collection=posts"), "tr/yangin-hortumu-secimi.mdx": () => import("../content/blog/tr/yangin-hortumu-secimi.mdx?collection=posts"), "tr/yangin-tesisati-tasarimi.mdx": () => import("../content/blog/tr/yangin-tesisati-tasarimi.mdx?collection=posts"), }),
};
export default browserCollections;