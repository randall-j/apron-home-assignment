import { TableContainer } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BorderedTableContainer = styled(TableContainer)`
  border-width: 1px;
  border-radius: 8px;
  padding: 12px;
`;
