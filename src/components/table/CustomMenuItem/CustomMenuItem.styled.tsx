import { TableCell } from "@mui/material";
import styled from "styled-components";

export const TableCellCustom = styled(TableCell)`
  position: relative;
`;

export const Label = styled.label`
  border: none;
  display: flex;

  cursor: pointer;

  input {
    display: none;
  }
`;

export const Notification = styled.span`
  display: inline-block;
  width: 16px; /* Largura da bolinha */
  height: 16px; /* Altura da bolinha */
  background: #FE8041;
  position: absolute;
  left: 36px;
  color: #fff;
  line-height: 16px; /* Para centralizar o texto verticalmente */
  text-align: center; /* Para centralizar o texto horizontalmente */
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
`;
