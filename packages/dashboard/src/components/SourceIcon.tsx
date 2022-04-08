import { Source } from "@home-finance/shared";

const TEMP_MAP: Record<Source, string> = {
  [Source.INTELIGO]: "Inteligo",
  [Source.ING]: "ING",
  [Source.MBANK_ANETA]: "mBank (Aneta)",
  [Source.MBANK_MICHAL]: "mBank (Michal)",
  [Source.MBANK_PROACTIVUS]: "mBank (Proactivus)",
  [Source.CASH]: "Gotowka",
  [Source.REVOLUT]: "Rev",
  [Source.SANTANDER_BANK]: "San",
  [Source.SANTANDER_CREDIT_CARD]: "San",
};

export const SourceIcon = ({ source }: { source: Source }) => (
  <strong>{TEMP_MAP[source]}</strong>
);
