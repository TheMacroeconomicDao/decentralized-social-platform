import styled from '@emotion/styled';

interface TableCellProps {
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
}
interface TableRowProps {
  cursor?: 'pointer' | 'default';
}

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 676px;
  color: ${({ theme }) => theme.primary.contrastText};
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.primary.dark};
  overflow: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.primary.dark};
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%; /* Добавь это */
`;

export const TableHead = styled.th<TableCellProps>`
  padding: 10px 25px;
  text-align: ${({ textAlign }) => textAlign || 'center'};
  width: ${({ width }) => width};
  white-space: nowrap;
  color: ${({ theme }) => theme.primary.contrastText};
`;

export const TableRow = styled.tr<TableRowProps>`
  cursor: ${({ cursor }) => cursor};
  &:last-child td {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.primary.dark};
    transition: background-color 0.1s ease;
  }
`;

export const TableBody = styled.tbody`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.body1.fontSize} !important;
  position: relative;
  overflow-y: auto;
  height: 100%;
`;

export const TableCell = styled.td<TableCellProps>`
  padding: 10px 25px;
  text-align: ${({ textAlign }) => textAlign || 'left'};
  width: ${({ width }) => width};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.secondary.dark};
  color: ${({ theme }) => theme.primary.contrastText};
`;

export const SortButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary.contrastText};
  padding: 4px 0px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.typography.table_body1.fontFamily};
  font-size: ${({ theme }) => theme.typography.table_body1.fontSize};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primary.dark};
    opacity: 0.9;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary.main};
    outline-offset: 2px;
  }
`;

export const EmptyState = styled.td`
  position: absolute;
  top: 159px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
`;
