import { test as base, expect } from '@playwright/test';
import { PlanContext, getIdentifiersToTest } from './context';

const test = base.extend<{ ctx: PlanContext }>({});

const testPlan = (planId: string) =>
  test.describe(planId, () => {
    //let plan: PlanInfo;
    test.describe.configure({ mode: 'serial' });

    test.use({
      ctx: async ({}, use) => {
        const planInfo = await PlanContext.fromPlanId(planId);
        await use(planInfo);
      },
    });

    /*
  test.beforeAll(async () => {
    plan = await getPlanInfo(planId);
  })
  */
    test.beforeEach(async ({ page }) => {
      return;
    });

    test('basic layout', async ({ page, ctx }) => {
      await page.goto(ctx.baseURL);
      await ctx.checkMeta(page);

      await expect(page.locator('nav#branding-navigation-bar')).toBeVisible();
      await expect(page.locator('nav#global-navigation-bar')).toBeVisible();
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.locator('main#main')).toBeVisible();
    });
    test('action list page', async ({ page, ctx }) => {
      const listItem = ctx.getActionListMenuItem()!;
      test.skip(!listItem, 'No action list page for plan');

      await page.goto(ctx.baseURL);
      await ctx.checkMeta(page);

      const nav = page.locator('nav#global-navigation-bar');
      const link = nav.getByRole('link', {
        name: listItem.page.title,
        exact: true,
      });

      // Test SPA navigation
      await link.click();
      await ctx.checkMeta(page);

      await expect
        .configure({ timeout: 15000 })(page.getByRole('tab').first())
        .toBeVisible();

      // Test direct URL navigation
      await page.goto(`${ctx.baseURL}/${listItem.page.urlPath}`);
      await ctx.checkMeta(page);
      await expect
        .configure({ timeout: 2000 })(page.getByRole('tab').first())
        .toBeVisible();
    });
    test('action details page', async ({ page, ctx }) => {
      test.skip(ctx.plan.actions.length == 0, 'No actions defined in plan');
      await page.goto(ctx.getActionURL(ctx.plan.actions[0]));
      await ctx.checkMeta(page);

      await expect(page.locator('.action-main-top')).toBeVisible();
    });

    test('category pages', async ({ page, ctx }) => {
      const categoryTypeItem = ctx.getCategoryTypeMenuItem();
      test.skip(!categoryTypeItem, 'No category type for plan');

      const items = ctx.getCategoryMenuItems();
      test.skip(!items, 'No category pages for plan');

      await page.goto(ctx.baseURL);
      await ctx.checkMeta(page);

      for (const item of items) {
        const nav = page.locator('nav#global-navigation-bar');
        const categoryTypeLink = nav.getByRole('link', {
          name: categoryTypeItem?.page.title,
          exact: true,
        });
        await categoryTypeLink.click();

        const link = nav.getByRole('link', {
          name: item.page.title,
          exact: true,
        });
        await link.click();
        await expect(page.locator('main#main')).toBeVisible();

        console.log(link);
      }
    });

    test('static pages', async ({ page, ctx }) => {
      const staticPageItems = ctx.getStaticPageMenuItem();
      console.log(staticPageItems);
      test.skip(!staticPageItems, 'No static pages for plan');

      await page.goto(ctx.baseURL);
      await ctx.checkMeta(page);

      for (const staticPageItem of staticPageItems) {
        const nav = page.locator('nav#global-navigation-bar');

        const staticPageLink = nav.getByRole('link', {
          name: staticPageItem?.page.title,
          exact: true,
        });

        await staticPageLink.click();
        await expect(page.locator('main#main')).toBeVisible();
      }
    });

    test('indicator list page', async ({ page, ctx }) => {
      const IndicatorListItem = ctx.getIndicatorListMenuItem()!;
      test.skip(!IndicatorListItem, 'No indicator list for plan');

      await page.goto(ctx.baseURL);
      await ctx.checkMeta(page);

      const nav = page.locator('nav#global-navigation-bar');
      const indicatorListLink = nav.getByRole('link', {
        name: IndicatorListItem.page.title,
        exact: true,
      });

      await indicatorListLink.click();
      await expect(page.locator('main#main')).toBeVisible();
      /*await expect(
        page.getByRole('heading', { name: 'Mittarit' })
      ).toBeVisible();*/
    });
  });

getIdentifiersToTest().forEach((plan) => testPlan(plan));
