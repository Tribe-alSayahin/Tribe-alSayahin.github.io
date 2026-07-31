import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import HeritageGallery from './HeritageGallery';

afterEach(cleanup);

describe('معرض الديار', () => {
  it('لا يعرض عالية نجد أو روابط الخريطة المحذوفة', () => {
    render(<HeritageGallery />);

    expect(screen.queryByText('عالية نجد (مواطن ورعي القبيلة)')).toBeNull();
    expect(screen.queryByRole('button', { name: /الخريطة/ })).toBeNull();
  });
});
