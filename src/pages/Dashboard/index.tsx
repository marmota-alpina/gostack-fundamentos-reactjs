import React, { useState, useEffect } from 'react';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue, { formatData } from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}
interface ApiResponse {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}
const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const apiResponse = (await api.get<ApiResponse>('transactions')).data;

      setBalance({
        income: formatValue(apiResponse.balance.income),
        outcome: formatValue(apiResponse.balance.outcome),
        total: formatValue(apiResponse.balance.total),
      });
      const transactionsFormattedData: Transaction[] = apiResponse.transactions.map(
        // eslint-disable-next-line @typescript-eslint/camelcase
        ({ id, title, value, type, category, created_at }) => {
          const formattedValue = formatValue(value);
          const formattedDate = formatData(created_at);

          return {
            id,
            title,
            value,
            formattedValue,
            formattedDate,
            type,
            category: { title: category.title },
            // eslint-disable-next-line @typescript-eslint/camelcase
            created_at,
          };
        },
      );

      setTransactions(transactionsFormattedData);
    }

    loadTransactions();
  }, [transactions, balance]);
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome' && ' - '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
