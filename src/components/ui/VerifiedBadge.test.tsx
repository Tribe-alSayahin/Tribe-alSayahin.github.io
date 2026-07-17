import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SUPPORTERS_DATA } from '../layout/Supporters.data';
import { VerifiedBadge } from './VerifiedBadge';

describe('verified identity badge', () => {
  it('has an accessible verified label', () => {
    render(<VerifiedBadge />);

    expect(screen.getByLabelText('موثق')).not.toBeNull();
  });

  it('marks Khalid bin Eid as verified', () => {
    const khalid = SUPPORTERS_DATA.find((supporter) =>
      supporter.name.startsWith('خالد بن عيد'),
    );

    expect(khalid?.verified).toBe(true);
  });
});
