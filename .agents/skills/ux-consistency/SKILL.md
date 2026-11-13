---
name: Form Validation & UX Consistency
description: Standards for form handling, validation, and consistent UI/UX feedback.
---

# Form Validation & UX Consistency

Follow these rules to satisfy "Konsistensi UI/UX" and "Validasi Form" requirements.

## 1. Form Validation with Zod
Use `react-hook-form` with `zod` for strictly typed validation.

```tsx
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  fee: z.number().min(0, "Fee cannot be negative"),
});

// Component
const { register, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

## 2. In-line Error Feedback
Always show error messages directly below the input field in red (`text-destructive`).

## 3. Consistent Spacing (The 4px Rule)
Use Tailwind spacing classes consistently:
- **Small spacing**: `gap-2` (8px), `p-2`
- **Medium spacing**: `gap-4` (16px), `p-4`
- **Large spacing**: `gap-8` (32px), `p-8`

## 4. State Feedback
Every action (Save, Delete, Update) must have:
- **Loading State**: Disable button and show a spinner.
- **Success State**: Show a `Sonner` or `Toast` notification.
- **Error State**: Show a clear explanation of why it failed.

## 5. Mobile Responsiveness
Always use a mobile-first approach. Test layouts using `flex-col md:flex-row`.

## 6. Internationalization (i18n) First
Never hardcode strings directly in the components.
- **Rule**: All user-facing text must use the `useTranslation` hook and be stored in the appropriate JSON locale files.
- **Example**: `t("common.save")` instead of `"Save"`.

## 7. Empty States & Zero-Data UX
Every data-driven view (tables, cards, search results) must provide a polished empty state instead of a blank canvas:
- **Visual Icon**: Soft muted icon with low-opacity circular background (e.g., `h-10 w-10 text-muted-foreground`).
- **Clear Copy**: Heading explaining what is missing, with a subtitle explaining why or how to resolve it.
- **Actionable Call-to-Action (CTA)**: Direct button to create new data or clear filters (e.g., "Reset Filter" or "Tambah Peserta").

```tsx
<div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border/60 bg-muted/10">
  <div className="p-3 mb-3 rounded-full bg-muted/40 text-muted-foreground">
    <SearchX className="w-8 h-8" />
  </div>
  <h3 className="text-base font-semibold text-foreground">{t("empty.title")}</h3>
  <p className="max-w-sm mt-1 text-xs text-muted-foreground">{t("empty.description")}</p>
  {onReset && (
    <Button variant="outline" size="sm" onClick={onReset} className="mt-4 gap-1.5">
      <RotateCcw className="w-3.5 h-3.5" />
      {t("common.resetFilters")}
    </Button>
  )}
</div>
```

## 8. Modal & Confirmation Dialogs
Never perform irreversible actions (e.g., Delete, Ban, Kick, Reset) without an explicit confirmation dialog:
- **Destructive Actions**: Use `variant="destructive"` on the confirm button.
- **Explicit Warning**: State clearly what data will be deleted or affected.
- **Dismissibility**: Ensure pressing `Escape` or clicking the backdrop safely closes the dialog without side effects.
- **Mobile Behavior**: Automatically collapse modals into bottom drawers (`Vaul` or Sheet) on mobile viewport for thumb-friendly reachability.

## 9. Accessibility (a11y) & Keyboard Navigation
Adhere to WCAG 2.1 AA accessibility standards:
- **Interactive Elements**: Every icon-only button must have an `aria-label` (e.g., `<Button aria-label={t("common.delete")} size="icon">`).
- **Focus Rings**: Never remove `outline: none` without providing an explicit Tailwind focus ring (e.g., `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
- **Color Contrast**: Verify text maintains at least 4.5:1 contrast against background in both dark and light modes.

## 10. Micro-interactions & Visual Polish
Make the interface feel responsive, tactile, and premium:
- **Active / Press States**: Add `active:scale-[0.98]` to buttons and clickable cards.
- **Transitions**: Use gentle, non-jarring transitions (e.g., `transition-all duration-150 ease-out`).
- **Interactive Hover Indicators**: Highlight table rows with subtle hover backgrounds (`hover:bg-muted/40 transition-colors`).
- **Status Badges**: Use semantic colors with muted background pills (e.g., emerald for Success/Active, amber for Pending/Warning, rose for Error/Inactive).

## 11. Error Boundaries & Graceful Degradation
Catch crashes at the component level to prevent full-page White Screen of Death (WSOD):
- Wrap independent widgets, tables, and dashboards with a React `ErrorBoundary`.
- Provide a clean retry button (`reset()`) and log the incident to Sentry/monitoring.

## 12. Perceived Performance & Zero-Jank UX
- **Skeleton Synchronization**: Skeletons must match the exact row height, border radius, and column proportions of the loaded component to eliminate Cumulative Layout Shift (CLS = 0).
- **Optimistic UI**: Mutate state immediately on user click, then revalidate in the background (with automatic rollback on error).
- **Debounced Inputs**: Real-time search inputs must debounce queries (minimum 300ms) to avoid stuttering and request spam.


