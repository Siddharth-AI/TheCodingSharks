'use client';

import type { WorkshopJson } from './types';
import { TemplateDarkHero } from './templates/dark-hero';
import { TemplateGradientVibrant } from './templates/gradient-vibrant';
import { TemplateCreamWarm } from './templates/cream-warm';
import { TemplateSplitMinimal } from './templates/split-minimal';
import { TemplateNeoCard } from './templates/neo-card';
import { TemplateTealFresh } from './templates/teal-fresh';
import { TemplateWarmModern } from './templates/warm-modern';

export type { WorkshopJson };

const TEMPLATES: Record<string, React.ComponentType<{ workshop: WorkshopJson }>> = {
  'dark-hero': TemplateDarkHero,
  'gradient-vibrant': TemplateGradientVibrant,
  'cream-warm': TemplateCreamWarm,
  'split-minimal': TemplateSplitMinimal,
  'neo-card': TemplateNeoCard,
  'teal-fresh': TemplateTealFresh,
  'warm-modern': TemplateWarmModern,
};

export function WorkshopDetailPage({ workshop }: { workshop: WorkshopJson }) {
  const Template = TEMPLATES[workshop.template] ?? TemplateDarkHero;
  return <Template workshop={workshop} />;
}
