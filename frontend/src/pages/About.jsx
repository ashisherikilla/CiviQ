import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Code2,
  Lightbulb,
  Mail,
  MessageSquare,
  Ruler,
  Users,
} from "lucide-react";

import mainLogo from "../assets/CiviQ_Logo.png";

function About() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-8">
      {/* =====================================================
          INTRODUCTION
          ===================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
            <img
              src={mainLogo}
              alt="CiviQ - Civil + Quantity"
              className="h-auto max-h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Civil + Quantity
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              About CiviQ
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              CiviQ is a digital Civil Engineering Estimation and BOQ Generator
              designed to make construction estimation workflows more
              structured, understandable, and easier to manage.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              It brings project information, work items, dimensions, quantities,
              rates, amounts, and BOQ preparation into a single digital
              workspace.
            </p>
          </div>
        </div>
      </section>



      {/* =====================================================
          WHY + STUDENTS
          ===================================================== */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-700">
              <Lightbulb size={20} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Why I Built CiviQ
            </h2>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p>I built CiviQ because I experienced the problem myself.</p>

            <p>
              When a process involves repeated calculations and spreadsheet
              management, it can become easy to focus more on formatting and
              manual work than on understanding the underlying engineering
              concepts.
            </p>

            <p>
              CiviQ is my attempt to move that workflow into a structured
              digital environment where the engineering logic remains visible
              while repetitive work becomes easier to manage.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-700">
              <Users size={20} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Built for Students
            </h2>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            CiviQ is being developed with students in mind. The goal is to
            provide a practical bridge between civil engineering concepts and
            software tools.
          </p>

          <ul className="mt-5 space-y-3">
            {[
              "Understand quantity calculations",
              "Organize estimation work",
              "Experiment with project-specific rates",
              "Understand cost calculations",
              "Prepare structured BOQs",
              "Reduce repetitive spreadsheet work",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            CiviQ is intended to support learning, not replace the underlying
            engineering concepts that students need to understand.
          </p>
        </div>
      </section>

      {/* =====================================================
          PROBLEM / APPROACH
          ===================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-blue-50 p-2 text-blue-700">
            <Calculator size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              What CiviQ Aims to Solve
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Bringing the estimation workflow together
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              The Problem
            </h3>

            <ul className="mt-4 space-y-3">
              {[
                "Repetitive manual calculations",
                "Spreadsheet-heavy organization",
                "Difficulty maintaining consistency",
                "Time spent formatting reports",
                "Separation between calculation and final BOQ",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              CiviQ Approach
            </h3>

            <div className="mt-4 space-y-2">
              {[
                ["Project", Ruler],
                ["Work Items", BookOpen],
                ["Dimensions → Quantity", Calculator],
                ["Project-Specific Rate", Code2],
                ["Amount → BOQ", CheckCircle2],
              ].map(([label, Icon], index, array) => (
                <div key={label}>
                  <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5">
                    <Icon size={17} className="shrink-0 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                  </div>

                  {index < array.length - 1 && (
                    <div className="ml-5 h-2 border-l border-dashed border-blue-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AUTHOR
          ===================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Code2 size={25} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              About the Author
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Erikilla Ashish
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Civil Engineering Student &amp; Software Developer
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              I am Erikilla Ashish, a Civil Engineering student interested in
              software development and building practical technology solutions.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              CiviQ is one of my attempts to combine both areas — using software
              engineering to solve a problem that originated from my own
              academic experience.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEEDBACK / CONTACT
          ===================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-blue-50 p-2 text-blue-700">
            <MessageSquare size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Feedback &amp; Suggestions
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Have an idea or suggestion?
            </h2>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
          CiviQ is an evolving project. If you find a bug, have an idea for
          improving the estimation workflow, or have a suggestion that could
          make CiviQ more useful for students, I would genuinely like to hear
          from you.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="mailto:erikillashish11@gmail.com?subject=CiviQ%20Feedback"
            className={[
              "inline-flex items-center justify-center gap-2 rounded-md",
              "bg-blue-600 px-4 py-2.5 text-sm font-medium text-white",
              "transition-colors duration-150",
              "hover:bg-blue-700",
              "focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <Mail size={17} />
            Send via Email App
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=erikillashish11@gmail.com&su=CiviQ%20Feedback"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "inline-flex items-center justify-center gap-2 rounded-md",
              "border border-slate-300 bg-white px-4 py-2.5",
              "text-sm font-medium text-slate-700",
              "transition-colors duration-150",
              "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
              "focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            <Mail size={17} />
            Open Gmail
          </a>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Or email directly at{" "}
          <a
            href="mailto:erikillashish11@gmail.com"
            className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
          >
            erikillashish11@gmail.com
          </a>
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Bug reports",
            "UI/UX suggestions",
            "Feature ideas",
            "Estimation improvements",
            "Student feedback",
          ].map((item) => (
            <span
              key={item}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
