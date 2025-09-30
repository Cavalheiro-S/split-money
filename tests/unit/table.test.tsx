import TransactionTable from "@/components/transaction-table/table";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

const categories = {
  id: "1",
  description: "category",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
const tags = {
  id: "1",
  description: "tag",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
const payment_status = {
  id: "1",
  description: "payment_status",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

test("renders transaction table with empty state", () => {
  render(<TransactionTable data={[]} />);
  expect(screen.getByText("Nenhuma transação cadastrada")).toBeDefined();
});

test("should render transaction table with two transactions", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
    {
      id: "2",
      description: "description 2",
      amount: 20,
      type: "outcome" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];

  render(<TransactionTable data={data} />);

  const firstRow = screen.getAllByRole("row")[1];
  expect(firstRow).toHaveTextContent("description 1");
  expect(firstRow).toHaveTextContent("R$ 50,00");
  expect(firstRow).toHaveTextContent(new Date().toLocaleDateString());
  expect(firstRow).toHaveTextContent("category");
  expect(firstRow).toHaveTextContent("payment_status");

  const secondRow = screen.getAllByRole("row")[2];
  expect(secondRow).toHaveTextContent("description 2");
  expect(secondRow).toHaveTextContent("R$ 20,00");
  expect(secondRow).toHaveTextContent(new Date().toLocaleDateString());
  expect(secondRow).toHaveTextContent("category");
  expect(secondRow).toHaveTextContent("payment_status");
});

test("should render transaction total right", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
    {
      id: "2",
      description: "description 2",
      amount: 20,
      type: "outcome" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];

  render(<TransactionTable data={data} />);

  const total = screen.getByText("R$ 30,00");
  expect(total).toBeDefined();
});

test("should render negative value", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 30,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
    {
      id: "2",
      description: "description 2",
      amount: 50,
      type: "outcome" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];

  render(<TransactionTable data={data} />);
  const total = screen.getByText((content) => {
    return content.includes("-R$ 20,00");
  });
  expect(total).toBeDefined();
});

test("should render item with no status", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: undefined,
      tags: tags,
    },
  ];

  render(<TransactionTable data={data} />);
  const itemWithNoStatus = screen.getByText("Sem status");
  expect(itemWithNoStatus).toBeDefined();
});

test("should render loading state", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];
  const { container } = render(<TransactionTable data={data} loading={true} />);
  const loadingState = screen.getAllByRole("loading");
  expect(loadingState).toHaveLength(5);
  expect(container).not.toHaveTextContent("description 1");
  expect(container).not.toHaveTextContent("R$ 50,00");
  expect(container).not.toHaveTextContent(new Date().toLocaleDateString());
  expect(container).not.toHaveTextContent("category");
  expect(container).not.toHaveTextContent("payment_status");
});

test("should render actions when receiving hasActions prop", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];
  render(<TransactionTable data={data} hasActions={true} />);
  const actions = screen.getByText("Ações");
  expect(actions).toBeDefined();
});

test("should render search when receiving showSearch prop", () => {
  const data = [
    {
      id: "1",
      description: "description 1",
      amount: 50,
      type: "income" as const,
      date: new Date().toISOString(),
      categories: categories,
      payment_status: payment_status,
      tags: tags,
    },
  ];
  
  render(<TransactionTable data={data} showSearch={true} />);
  const filtersElement = screen.getByPlaceholderText("Buscar por descrição...");
  expect(filtersElement).toBeDefined();
});
