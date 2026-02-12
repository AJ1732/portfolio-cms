import Link from "next/link";

import { ReactQueryToastPromiseExample } from "@/components/display";
import { FactCard } from "@/components/elements";
import { getWritings } from "@/lib/sanity/getters";
import {
  ArticleSection,
  CodeBlock,
  WritingHeader,
} from "@/sections/writings-page/components";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch all writings (cached) to calculate article number
  const writings = await getWritings();
  const articleIndex = writings.findIndex((w) => w.slug === slug);
  const articleNumber = articleIndex !== -1 ? articleIndex + 1 : 1;

  return (
    <div
      className="content-grid text-base-expand place-content-start space-y-8 py-14 lg:py-20"
      style={
        { "--content-max-width": "max(50rem, 50vw)" } as React.CSSProperties
      }
    >
      <WritingHeader
        number={articleNumber}
        title={
          <>
            Using React Query and{" "}
            <Link
              href="https://sonner.emilkowal.ski/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-underline-round-dots hover:text-orange-500"
            >
              Sonner's
            </Link>{" "}
            <code className="bg-neutral-50 text-neutral-900">
              toast.promise()
            </code>{" "}
            for better UX.
          </>
        }
        description={
          <>
            Combining React Query&apos;s mutation state with Sonner&apos;s{" "}
            <code>toast.promise()</code>.
          </>
        }
        publishedAt={{
          display: "28th February, 2026",
          datetime: "2026-02-28",
        }}
      />

      <ReactQueryToastPromiseExample />

      <article aria-label="Article content" className="space-y-8">
        {/* ---- Introduction ---- */}
        <ArticleSection id="silent-signup" title="The Silent Signup Problem">
          <p>
            You fill out a registration form. You click &ldquo;Sign Up.&rdquo;
            The button&hellip; does something? Maybe it goes grey. Maybe a
            spinner appears. You wait. Did it work? Is it still loading? Should
            you click again?
          </p>
          <p>
            This is the default experience on most web apps &mdash; and
            it&apos;s entirely avoidable. The issue isn&apos;t the backend. The
            request went through. The account was created. But the user never{" "}
            <em>felt</em> it. That disconnect between system state and user
            perception is where trust breaks down.
          </p>
        </ArticleSection>

        {/* ---- Two Libraries, One Pattern ---- */}
        <ArticleSection id="two-libraries" title="Two Libraries, One Pattern">
          <p>
            React Query (TanStack Query) and Sonner solve different problems
            that, together, close this gap completely.
          </p>
          <p>
            <strong>React Query</strong> manages server state &mdash; it tracks
            whether a mutation is pending, successful, or failed, and gives you
            reactive values to build your UI around.
          </p>
          <p>
            <strong>Sonner</strong> (via <code>toast.promise</code>) handles
            notification-level feedback &mdash; it watches a promise and
            automatically renders the right toast at each lifecycle stage.
          </p>
          <p>
            Used together, they give you both <em>local</em> feedback (button
            states, inline spinners) and <em>global</em> feedback (persistent
            toast notifications) from a single mutation call.
          </p>
        </ArticleSection>

        {/* ---- The Signup Flow ---- */}
        <ArticleSection id="signup-flow" title="The Signup Flow">
          <p>Here&apos;s a real registration form handler that uses both:</p>

          <CodeBlock label="Signup form handler code example" className="mt-6">
            {`const { mutateAsync: registerUser, isPending } = useRegisterUser();

              async function onSubmit(data: z.infer<typeof registerFormSchema>) {
                toast.promise(
                  registerUser(
                    { user: data },
                    {
                      onSuccess: () => {
                        setTimeout(() => {
                          window.location.href = "/app/setup";
                        }, 1000);
                      },
                      onError: (error: any) => {
                        console.error("Registration error:", error?.message);
                      },
                    }
                  ),
                  {
                    loading: "Creating your account...",
                    success: () => ({
                      message: "Registration successful!",
                      description: "Redirecting to store...",
                    }),
                    error: (error: any) => ({
                      message: "Registration failed",
                      description: error?.message || "Please try again.",
                    }),
                  }
                );
              }`}
          </CodeBlock>

          <p>
            There&apos;s a lot happening in a small surface area. Let&apos;s
            unpack it.
          </p>
        </ArticleSection>

        {/* ---- useRegisterUser ---- */}
        <ArticleSection
          id="use-register-user"
          title="How useRegisterUser Sets the Foundation"
        >
          <p>
            The <code>useRegisterUser</code> hook is a thin wrapper around{" "}
            <code>useMutation</code> from React Query. It returns two things we
            care about:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>
                <code>mutateAsync</code>
              </strong>{" "}
              &mdash; a function that triggers the mutation and returns a
              promise. This is critical because <code>toast.promise</code> needs
              a promise to watch.
            </li>
            <li>
              <strong>
                <code>isPending</code>
              </strong>{" "}
              &mdash; a boolean that&apos;s <code>true</code> while the request
              is in flight.
            </li>
          </ul>
          <p>
            The distinction between <code>mutate</code> and{" "}
            <code>mutateAsync</code> matters here. <code>mutate</code> is
            fire-and-forget &mdash; it doesn&apos;t return a promise, so you
            can&apos;t pass it to <code>toast.promise</code>.{" "}
            <code>mutateAsync</code> does, which is what makes this pattern
            possible.
          </p>
        </ArticleSection>

        {/* ---- toast.promise ---- */}
        <ArticleSection id="toast-promise" title="How toast.promise Takes Over">
          <p>
            Sonner&apos;s <code>toast.promise</code> accepts two arguments: a
            promise and a configuration object mapping three states to
            user-facing messages.
          </p>

          <CodeBlock label="toast.promise API shape">
            {`toast.promise(promise, {
              loading: "Creating your account...",
              success: () => ({ message: "...", description: "..." }),
              error: (error) => ({ message: "...", description: "..." }),
            });`}
          </CodeBlock>

          <p>
            The moment <code>registerUser()</code> fires, a toast appears with
            &ldquo;Creating your account&hellip;&rdquo; &mdash; the user
            immediately knows their submission was received and the system is
            working. When the promise resolves, the same toast morphs into the
            success message. When it rejects, it morphs into the error. One
            toast, three states, zero manual state management.
          </p>
        </ArticleSection>

        {/* ---- Two Layers of Feedback ---- */}
        <ArticleSection id="two-layers" title="The Two Layers of Feedback">
          <p>
            This is where the pattern becomes powerful. You have feedback at two
            levels:
          </p>

          <h3>Global: The Toast</h3>
          <p>
            The toast persists regardless of scroll position or focus. If the
            user scrolls away from the form, the toast still tells them
            what&apos;s happening. It&apos;s ambient, non-blocking, and
            informational.
          </p>

          <h3>Local: The Button</h3>
          <p>
            The <code>isPending</code> value from React Query drives the submit
            button:
          </p>

          <CodeBlock label="Button with isPending state" className="mt-6">
            {`<button type="submit" disabled={isPending}>
                {isPending ? "Creating account..." : "Sign Up"}
              </button>`}
          </CodeBlock>

          <p>
            This prevents double-submission at the source. The button says
            &ldquo;you can&apos;t do this again right now.&rdquo; The toast says
            &ldquo;here&apos;s what&apos;s happening with your request.&rdquo;
            They serve different purposes. Use both.
          </p>
        </ArticleSection>

        <figure
          className="aspect-10/3 overflow-hidden bg-neutral-50 ring"
          role="img"
          aria-label="Diagram showing the two layers of user feedback"
        />

        {/* ---- Fact Card ---- */}
        <FactCard
          text={
            <>
              <code>mutate</code> is fire-and-forget and doesn&apos;t return a
              promise, while <code>mutateAsync</code> returns a promise &mdash;
              making it the only option that works with{" "}
              <code>toast.promise</code>.
            </>
          }
          className="text-base-expand md:text-base-expand lg:text-base-expand"
        />

        {/* ---- Redirect Delay ---- */}
        <ArticleSection
          id="redirect-delay"
          title="Why the 1-Second Redirect Delay Exists"
        >
          <CodeBlock label="Redirect delay code">
            {`onSuccess: () => {
              setTimeout(() => {
                window.location.href = "/app/setup";
              }, 1000);
            },`}
          </CodeBlock>

          <p>
            This is a deliberate UX decision, not a hack. Without the delay, the
            success toast flashes for a frame and then the page navigates
            &mdash; the user sees a blur of green and a completely new screen
            with no context.
          </p>
          <p>
            The 1-second pause lets the &ldquo;Registration successful!
            Redirecting to store&hellip;&rdquo; message register. The user reads
            it, understands what just happened, and <em>then</em> the page
            changes. The redirect becomes expected rather than jarring.
          </p>
        </ArticleSection>

        {/* ---- Actionable Errors ---- */}
        <ArticleSection id="actionable-errors" title="Making Errors Actionable">
          <p>The error handler surfaces the actual server message:</p>

          <CodeBlock label="Error handler code" className="mt-6">
            {`error: (error: any) => ({
              message: "Registration failed",
              description: error?.message || "Please try again.",
            })`}
          </CodeBlock>

          <p>
            This turns errors from dead ends into recoverable moments.
            &ldquo;Email already in use&rdquo; tells the user exactly what went
            wrong and implies what to do next. Compare that to a generic
            &ldquo;Something went wrong&rdquo; &mdash; which tells them nothing
            and breeds frustration.
          </p>
          <p>
            If your API returns structured error messages, always surface them.
            The fallback (&ldquo;Please try again&rdquo;) should be a last
            resort, not the default.
          </p>
        </ArticleSection>

        {/* ---- Good Feedback Table ---- */}
        <ArticleSection
          id="good-feedback"
          title="What Good Feedback Looks Like"
        >
          <div className="full-width overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of weak versus strong feedback messages for each
                request state
              </caption>
              <thead>
                <tr className="border-b border-neutral-200">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    State
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Weak
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Strong
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium">Loading</td>
                  <td className="px-4 py-3 text-neutral-500">
                    &ldquo;Loading&hellip;&rdquo;
                  </td>
                  <td className="px-4 py-3">
                    &ldquo;Creating your account&hellip;&rdquo;
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium">Success</td>
                  <td className="px-4 py-3 text-neutral-500">
                    &ldquo;Done!&rdquo;
                  </td>
                  <td className="px-4 py-3">
                    &ldquo;Registration successful! Redirecting to
                    store&hellip;&rdquo;
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Error</td>
                  <td className="px-4 py-3 text-neutral-500">
                    &ldquo;Error&rdquo;
                  </td>
                  <td className="px-4 py-3">
                    &ldquo;Registration failed &mdash; email already in
                    use.&rdquo;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The difference is specificity. &ldquo;Loading&rdquo; describes the
            computer&apos;s state. &ldquo;Creating your account&rdquo; describes
            the user&apos;s journey. Strong feedback is always written from the
            user&apos;s perspective, not the system&apos;s.
          </p>
        </ArticleSection>

        {/* ---- Generalized Pattern ---- */}
        <ArticleSection
          id="generalized-pattern"
          title="The Pattern Generalized"
        >
          <p>
            This isn&apos;t specific to signup. Any mutation &mdash; login, file
            upload, payment, profile update &mdash; follows the same shape:
          </p>

          <CodeBlock
            label="Generalized mutation pattern with toast.promise"
            className="mt-6"
          >
            {`const { mutateAsync, isPending } = useSomeMutation();

              function handleAction(data) {
                toast.promise(
                  mutateAsync(data, {
                    onSuccess: () => { /* navigate, invalidate cache, etc. */ },
                    onError: (error) => { /* log, track, recover */ },
                  }),
                  {
                    loading: "Doing the thing...",
                    success: "Thing done!",
                    error: (err) => err.message || "Thing failed.",
                  }
                );
              }
            `}
          </CodeBlock>

          <p>
            Once you internalize this, you&apos;ll notice every form in your app
            that <em>doesn&apos;t</em> follow it. And each one is a place where
            users are left guessing.
          </p>
        </ArticleSection>

        {/* ---- Conclusion ---- */}
        <ArticleSection id="wrapping-up" title="Wrapping Up">
          <p>
            The combination of React Query and <code>toast.promise</code> gives
            you a declarative, minimal-code pattern for something that has an
            outsized impact on how your product feels. No manual loading states.
            No forgotten error handlers. No silent successes.
          </p>
          <p>
            The user clicks a button. They&apos;re told what&apos;s happening.
            They&apos;re told when it&apos;s done. They&apos;re told when it
            fails and why. That&apos;s the entire UX improvement. And it takes
            about ten lines of code.
          </p>
        </ArticleSection>
      </article>
    </div>
  );
}
