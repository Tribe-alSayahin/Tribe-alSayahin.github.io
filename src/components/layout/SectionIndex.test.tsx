import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SectionIndex } from './SectionIndex';

afterEach(cleanup);

describe('فهرس أقسام الصفحة', () => {
  it('يجمع اسم القسم ووصفه في الاسم القابل للوصول', () => {
    render(
      <SectionIndex
        sections={[
          {
            id: 'gallery',
            title: 'الديار التابعة للقبيلة',
            description: 'شواهد الديار وقصصها الموثقة.',
          },
        ]}
      />,
    );

    expect(screen.getByRole('link', {
      name: 'الديار التابعة للقبيلة شواهد الديار وقصصها الموثقة.',
    })).toBeTruthy();
  });
});
