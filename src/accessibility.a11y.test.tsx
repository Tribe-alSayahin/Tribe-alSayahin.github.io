import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';

afterEach(cleanup);

async function expectNoSeriousAxeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    rules: {
      // jsdom has no layout engine; contrast remains a browser-level audit.
      'color-contrast': { enabled: false },
    },
  });
  const seriousViolations = results.violations.filter(
    ({ impact }) => impact === 'serious' || impact === 'critical',
  );

  expect(seriousViolations).toEqual([]);
}

describe('real axe-core accessibility checks', () => {
  it('finds no serious violations in a labelled Arabic form', async () => {
    const { container } = render(
      <main lang="ar" dir="rtl">
        <h1>نموذج إدارة الخبر</h1>
        <form>
          <label htmlFor="news-title">عنوان الخبر</label>
          <input id="news-title" name="title" required />
          <Button type="submit">حفظ الخبر</Button>
        </form>
      </main>,
    );

    await expectNoSeriousAxeViolations(container);
  });

  it('finds no serious violations in the shared modal', async () => {
    const { container } = render(
      <Modal isOpen onClose={() => undefined} title="تأكيد الحذف">
        <p>هل تريد حذف العنصر؟</p>
        <Button type="button">تأكيد</Button>
      </Modal>,
    );

    await expectNoSeriousAxeViolations(container);
  });
});
