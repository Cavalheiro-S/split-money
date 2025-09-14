import TransactionActionModal from "./action-modal";
import TransactionTableContainer from "./container";
import TransactionTableHeader from "./header";
import TransactionTablePagination from "./pagination";
import TransactionTable from "./table";
import StatsCards from "./stats-cards";
import MobileTransactionCard from "./mobile-transaction-card";


export const TableTransaction = {
    Container: TransactionTableContainer,
    Header: TransactionTableHeader,
    Table: TransactionTable,
    ActionModal: TransactionActionModal,
    Pagination: TransactionTablePagination,
    StatsCards: StatsCards,
    MobileCard: MobileTransactionCard
}