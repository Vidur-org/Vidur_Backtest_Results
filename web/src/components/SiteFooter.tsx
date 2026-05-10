export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-stone-600 sm:px-6">
        <p className="font-medium text-stone-800">Important disclaimer</p>
        <p className="mt-3 max-w-3xl leading-relaxed">
          This presentation surface summarizes multi-model research outputs for diligence and
          demonstration purposes only. It is{" "}
          <span className="font-medium text-stone-900">not investment advice</span>, not an offer to
          buy or sell securities, and may contain forward-looking statements and model-generated
          errors. Past backtests do not guarantee future results. Verify material facts
          independently before making any investment decision.
        </p>
        <p className="mt-6 text-xs text-stone-500">
          Built from structured scenario exports; adjudication and scores reflect internal judging
          logic used at generation time.
        </p>
      </div>
    </footer>
  );
}
