import { Button, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";
import styled, { css } from "styled-components";

interface IAppMenuProps {
  logged: boolean;
  isScreenSmall: boolean;
}

export const AppMenuStyled = styled.div<IAppMenuProps>`
  visibility: ${(props) => (props.logged ? "visible" : "hidden")};
  height: ${(props) => (props.logged ? "46px" : "0px")};
  opacity: ${(props) => (props.logged ? "1" : "0")};
  padding: ${(props) => (props.logged ? "4px" : "0px")};
  background-color: #fff;
  transition: visibility 0.5, opacity 0.5 linear;
  color: #5a635a;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.isScreenSmall &&
    css`
      display: flex;
      justify-content: space-between;

      img {
        margin-left: 115px;
      }
    `}
`;

export const UserMenu = styled(Menu)``;

interface IMenuStyledProps {
  isScreenSmall: boolean;
}
export const MenuStyled = styled.div<IMenuStyledProps>`
  ${(props) =>
    !props.isScreenSmall &&
    css`
      flex: 1;
    `}
  position: relative;
`;

export const AppMenuInfo = styled.div``;

export const AppMenuConfig = styled.div``;

export const MenuContentLarge = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

export const LogoLarge = styled.div`
  margin-right: 16px;
  &:hover {
    cursor: pointer;
  }

  img {
    width: 160px;
  }
`;

export const LogoSmall = styled.div`
  width: 250px;
  padding: 16px 0 0 16px;
  margin-bottom: 16px;

  &:hover {
    cursor: pointer;
  }

  img {
    width: 180px;
  }
`;

interface IMenuButton {
  selected?: boolean;
}

export const MenuButton = styled(Button)<IMenuButton>`
  && {
    text-transform: none;
    margin-left: 10px !important;
    margin-right: 10px !important;
    white-space: nowrap;
    overflow: hidden;
    color: #5a635a;

    &:hover {
      cursor: pointer;
    }

    ${(props) =>
      props.selected &&
      css`
        color: #3fa110;
      `}
  }
`;

export const ConfigButton = styled(Button)`
  && {
    text-transform: capitalize !important;
    margin-left: -10px !important;
    margin-right: -10px !important;
  }
`;

export const ButtonMenuCustom = styled(Button)`
  && {
    text-transform: none;
  }
`;

export const MenuContainer = styled.div`
  display: flex;
`;

export const MenuContentSmall = styled.div`
  display: flex;
  background-color: #fff;
  min-width: 200px;
  flex-direction: column;
  height: 100%;
`;

interface IMenuButton {
  selected?: boolean;
}

export const MenuItemCustom = styled(MenuItem)<IMenuButton>`
  && {
    font-size: 14px;

    ${(props) =>
      props.selected &&
      css`
        color: #3fa110;
      `}
  }
`;

export const ListItemMenuSmall = styled(ListItem)`
  && {
    height: 40px;
    padding: 0 16px;
    cursor: pointer;
    transition: background 0.2s;

    svg {
      color: #5a635a;
    }

    &:hover {
      background: #f0f8ec;
    }
  }
`;

interface IListItemTextMuiProps {
  selected: boolean;
}

export const ListItemTextMenuSmall = styled(
  ListItemText
)<IListItemTextMuiProps>`
  && {
    span {
      font-size: 14px;
      font-weight: 400;
      color: #5a635a;
    }

    ${(props) =>
      props.selected &&
      css`
        span {
          color: #3fa110;
        }
      `}
  }
`;

interface IListItemTileMuiProps {
  selected: boolean;
}

export const ListItemTileMenuSmall = styled(
  ListItemText
)<IListItemTileMuiProps>`
  && {
    span {
      font-weight: 600;
      color: #5a635a;
    }

    ${(props) =>
      props.selected &&
      css`
        span {
          color: #3fa110;
        }
      `}
  }
`;
