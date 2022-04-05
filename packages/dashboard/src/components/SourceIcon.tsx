import { Source } from "@home-finance/shared";

const TEMP_MAP: Record<Source, string> = {
  [Source.INTELIGO]: "Inteligo",
  [Source.ING]: "ING",
  [Source.MBANK_COMPANY]: "mBank",
  [Source.MBANK_PRIVATE]: "mBank",
  [Source.REVOLUT]: "Rev",
  [Source.SANTANDER_BANK]: "San",
  [Source.SANTANDER_CREDIT_CARD]: "San",
};

export const SourceIcon = ({ source }: { source: Source }) => (
  <strong>{TEMP_MAP[source]}</strong>
);
