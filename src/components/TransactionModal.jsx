import { AnimatePresence, motion } from "framer-motion";
import StatusBadge from "./StatusBadge.jsx";

export default function TransactionModal({ txn, onClose }) {
  const mailStatus = txn?.mailSent ? "Sent" : txn?.mailError ? "Failed" : "Pending";
  return (
    <AnimatePresence>
      {txn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-xl rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Transaction Analysis</h3>
              <StatusBadge status={txn.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-400">Entered Amount</p><p>{txn.amount ?? "-"}</p></div>
              <div><p className="text-slate-400">Matched Amount</p><p>{txn.matchedAmount ?? "-"}</p></div>
              <div><p className="text-slate-400">Entered UTR</p><p>{txn.utr ?? "-"}</p></div>
              <div><p className="text-slate-400">Matched UTR</p><p>{txn.matchedUtr ?? "-"}</p></div>
              <div><p className="text-slate-400">Match Score</p><p>{txn.matchScore ?? 0}%</p></div>
              <div><p className="text-slate-400">Confidence</p><p>{txn.analysis?.confidence ?? txn.matchScore ?? 0}%</p></div>
              <div className="col-span-2"><p className="text-slate-400">Reason</p><p>{txn.reason || "No reason available"}</p></div>
              <div className="col-span-2"><p className="text-slate-400">Email Status</p><p>{mailStatus}</p></div>
              {txn.mailTimestamp ? (
                <div className="col-span-2"><p className="text-slate-400">Mail Timestamp</p><p>{new Date(txn.mailTimestamp).toLocaleString()}</p></div>
              ) : null}
              {txn.mailError ? (
                <div className="col-span-2"><p className="text-slate-400">Mail Error</p><p className="text-rose-300">{txn.mailError}</p></div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
