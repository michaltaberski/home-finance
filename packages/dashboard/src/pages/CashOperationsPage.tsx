import { Source } from "@home-finance/shared";
import { Button, PageHeader } from "antd";
import { useState } from "react";
import { CreateOrUpdateOperationModal } from "../components/CreateOrUpdateOperationModal";
import { OperationsTable } from "../components/OperationsTable";
import { useStore } from "../useStore";

export const CashOperationsPage = () => {
  const {
    operations: allOperations,
    isLoadingOperations,
    updateFilters,
    filterProps,
  } = useStore();
  const cashOperations = allOperations.filter(
    ({ source }) => Source.CASH === source
  );
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className="site-layout-content">
      <PageHeader
        className="site-page-header"
        title="Cash operations [TODO]"
        // subTitle="This is a subtitle"
      />
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Open modal
      </Button>
      <CreateOrUpdateOperationModal
        isVisible={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <OperationsTable
        isLoading={isLoadingOperations}
        operations={cashOperations}
        filters={filterProps}
        onFilterChange={updateFilters}
      />
    </div>
  );
};
