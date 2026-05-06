import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  MailCheck,
  Database,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock3,
  FileSpreadsheet,
  Activity,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Zap size={28} />,
      title: "Queue-Based Verification Engine",
      desc: "Powered with BullMQ + Redis architecture for scalable asynchronous transaction processing.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "AI-Based Match Scoring",
      desc: "Smart score-driven reconciliation engine with exact, partial, suspicious, and unmatched detection.",
    },
    {
      icon: <MailCheck size={28} />,
      title: "Automated Email Notifications",
      desc: "Automatically notify users with verification status and detailed payment reconciliation reports.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Advanced Analytics Dashboard",
      desc: "Visualize transaction insights with charts, status trends, verification ratios, and export-ready reports.",
    },
    {
      icon: <Database size={28} />,
      title: "Persistent Event Management",
      desc: "Store and revisit all events, transactions, analytics, mail statuses, and exported reports anytime.",
    },
    {
      icon: <FileSpreadsheet size={28} />,
      title: "CSV Export & Audit Reports",
      desc: "Generate downloadable reconciliation reports with scores, statuses, and detailed transaction analysis.",
    },
  ];

  const workflow = [
    "Create Verification Event",
    "Upload Payer & Bank CSV Files",
    "Queue-Based Background Processing",
    "AI Match Scoring & Fraud Detection",
    "Email Notification Dispatch",
    "Analytics & Export Generation",
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute right-[-120px] bottom-[-120px] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Navbar */}
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-4 backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              NexPay
            </h1>
            <p className="text-sm text-slate-400">
              Intelligent Payment Reconciliation Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-medium transition hover:border-indigo-500 hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <Activity size={16} />
              Queue-Driven Fintech Verification SaaS
            </div>

            <h2 className="mt-8 max-w-5xl text-6xl font-black leading-tight tracking-tight">
              Reconcile Payments with
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                AI-Grade Confidence
              </span>
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              NexPay is a modern queue-powered payment reconciliation platform
              built for fintech workflows, institutions, and enterprise-scale
              verification systems. Upload bulk transaction files, run
              intelligent matching engines, generate analytics, detect
              suspicious payments, and automate verification communication —
              all from a single powerful dashboard.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-7 py-4 font-semibold text-white transition hover:scale-105 hover:bg-indigo-400"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/dashboard"
                className="rounded-2xl border border-slate-700 px-7 py-4 font-semibold transition hover:border-cyan-400 hover:bg-slate-800"
              >
                Open Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-20 grid gap-6 md:grid-cols-4">
            {[
              { label: "Transactions Processed", value: "1M+" },
              { label: "Verification Accuracy", value: "98.7%" },
              { label: "Async Queue Jobs", value: "500K+" },
              { label: "Enterprise Ready", value: "24/7" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl"
              >
                <h3 className="text-4xl font-bold text-white">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-10">
          <div className="mb-14 text-center">
            <h3 className="text-4xl font-bold">
              Enterprise Verification Features
            </h3>

            <p className="mx-auto mt-5 max-w-3xl text-slate-400">
              Built with scalable backend architecture, intelligent
              reconciliation workflows, async processing, and production-ready
              analytics systems.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                whileHover={{ y: -6 }}
                key={feature.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl transition"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                  {feature.icon}
                </div>

                <h4 className="mt-6 text-2xl font-semibold">
                  {feature.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="py-24">
          <div className="mb-16 text-center">
            <h3 className="text-4xl font-bold">
              Intelligent Verification Workflow
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-slate-400">
              NexPay automates the complete payment verification lifecycle
              using scalable queue-based processing architecture.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl"
              >
                <div className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold">
                  {index + 1}
                </div>

                <Clock3 className="mb-6 text-cyan-400" size={32} />

                <h4 className="text-xl font-semibold">
                  {step}
                </h4>

                <p className="mt-4 text-slate-400">
                  Fully automated and optimized for high-volume financial
                  verification workflows.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why NexPay */}
        <section className="py-20">
          <div className="rounded-[40px] border border-slate-800 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-12 backdrop-blur-xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h3 className="text-5xl font-bold leading-tight">
                  Designed for Modern Financial Operations
                </h3>

                <p className="mt-8 text-lg leading-8 text-slate-300">
                  NexPay combines scalable queue systems, intelligent
                  transaction scoring, analytics-driven workflows, and
                  automated communication into one centralized SaaS platform.
                </p>

                <div className="mt-10 space-y-5">
                  {[
                    "Queue-Based Distributed Processing",
                    "Advanced Match Confidence Scoring",
                    "Automated Verification Emails",
                    "Detailed Transaction Analytics",
                    "Exportable Audit Reports",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="text-green-400" size={22} />
                      <span className="text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-950/60 p-8">
                <div className="space-y-5">
                  <div className="rounded-2xl bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">
                      Queue Processing
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-indigo-400">
                      BullMQ + Redis
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">
                      Matching Accuracy
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-cyan-400">
                      98.7%
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">
                      Average Processing Speed
                    </p>
                    <h4 className="mt-2 text-3xl font-bold text-green-400">
                      &lt; 5 Seconds
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <h3 className="text-5xl font-bold">
            Ready to Transform Payment Verification?
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Build scalable reconciliation workflows, automate transaction
            analysis, and gain complete visibility into your financial
            verification operations.
          </p>

          <div className="mt-10 flex justify-center gap-5">
            <Link
              to="/register"
              className="rounded-2xl bg-indigo-500 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-indigo-400"
            >
              Get Started
            </Link>

            <Link
              to="/dashboard"
              className="rounded-2xl border border-slate-700 px-8 py-4 font-semibold transition hover:border-cyan-400 hover:bg-slate-800"
            >
              Explore Dashboard
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-10 text-center">
          <h4 className="text-2xl font-bold">NexPay</h4>

          <p className="mt-3 text-slate-400">
            Intelligent Queue-Based Payment Reconciliation Platform
          </p>

          <div className="mt-6 flex justify-center gap-8 text-sm text-slate-500">
            <span>Queue Processing</span>
            <span>Analytics</span>
            <span>Fraud Detection</span>
            <span>Automation</span>
          </div>

          <p className="mt-8 text-sm text-slate-600">
            © {new Date().getFullYear()} NexPay. Built for modern fintech
            operations.
          </p>
        </footer>
      </div>
    </div>
  );
}