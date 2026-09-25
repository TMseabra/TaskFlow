const faqs = [
  {
    question: "Is TaskFlow free?",
    answer:
      "Yes. TaskFlow is a portfolio project and can be used freely to organize your tasks.",
  },
  {
    question: "Do I need a credit card to sign up?",
    answer:
      "No. Just an email and password, or sign in with your Google or GitHub account.",
  },
  {
    question: "Can I use it on my phone?",
    answer:
      "Yes, the site is fully responsive and works well on phone, tablet and desktop.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Each account only sees and manages its own tasks — never other users'.",
  },
  {
    question: "Can I change a task's status or priority after creating it?",
    answer:
      "Yes, at any time. You can edit the title, description, status, priority and due date of every task.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-center text-4xl font-bold text-ink">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-center text-lg text-body">
        Hover over a question to see the answer.
      </p>
      <div className="mt-12 divide-y divide-line rounded-xl border border-line bg-card">
        {faqs.map((faq) => (
          <div key={faq.question} className="group">
            <div className="flex w-full cursor-default select-none items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink">
              {faq.question}
              <span className="shrink-0 text-2xl text-muted transition-transform duration-300 group-hover:rotate-45">
                +
              </span>
            </div>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-base text-body">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
