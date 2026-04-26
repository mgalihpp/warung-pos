ALTER TABLE "transaction"
RENAME COLUMN "invoiceNumber" TO "transactionNumber";

ALTER INDEX "transaction_invoiceNumber_key"
RENAME TO "transaction_transactionNumber_key";

ALTER INDEX "transaction_invoiceNumber_idx"
RENAME TO "transaction_transactionNumber_idx";
