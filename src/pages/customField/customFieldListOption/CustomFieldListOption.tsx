import React, {
  HtmlHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Checkbox, IconButton, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { Actions, Container } from "./CustomFieldListOption.styles";
import ICustomFieldListOption from "../../../interfaces/ICustomFieldListOption";
import { useCustomFieldListOptions } from "../../../hooks/customFieldsListOptions";

interface ICustomFieldListOptionProps
  extends HtmlHTMLAttributes<HTMLDivElement> {
  itemIndex: number;
  customFieldListOption: ICustomFieldListOption;
  handleAddItem: () => void;
  handleDeleteItem: () => void;
  listType: "SIMPLE" | "MULTIPLE";
}

const CustomFieldListOption: React.FC<ICustomFieldListOptionProps> = ({
  itemIndex,
  customFieldListOption,
  handleAddItem,
  handleDeleteItem,
  listType,
}) => {
  const { customFieldListOptionsContext, setCustomFieldListOptionsContext } =
    useCustomFieldListOptions();

  const [description, setDescription] = useState(
    customFieldListOption.description
  );

  useEffect(() => {
    customFieldListOptionsContext[itemIndex].description = description;

    setCustomFieldListOptionsContext(customFieldListOptionsContext);
  }, [description]);

  const handleChengeSelectedDefault = useCallback(() => {
    if (listType === "SIMPLE") {
      const newCustomFieldListOptions = customFieldListOptionsContext.map(
        (option) => {
          option.selectedDefault = false;

          return option;
        }
      );

      newCustomFieldListOptions[itemIndex].selectedDefault =
        !customFieldListOption.selectedDefault;

      setCustomFieldListOptionsContext(newCustomFieldListOptions);
    }

    if (listType === "MULTIPLE") {
      const newCustomFieldListOptions = customFieldListOptionsContext.map(
        (option) => {
          return option;
        }
      );

      newCustomFieldListOptions[itemIndex].selectedDefault =
        !customFieldListOption.selectedDefault;

      setCustomFieldListOptionsContext(newCustomFieldListOptions);
    }
  }, [
    listType,
    customFieldListOptionsContext,
    customFieldListOption.selectedDefault,
    itemIndex,
  ]);

  return (
    <Container>
      <Checkbox
        checked={customFieldListOption.selectedDefault}
        onChange={() => {
          handleChengeSelectedDefault();
        }}
      />

      <TextField
        sx={{ width: "100%" }}
        size="small"
        label=""
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Actions>
        {customFieldListOptionsContext.length - 1 === itemIndex && (
          <>
            <Tooltip title="Adicionar item" placement="top">
              <IconButton
                onClick={() => handleAddItem()}
                size="small"
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Deletar item" placement="top">
              <IconButton
                onClick={() => handleDeleteItem()}
                size="small"
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Actions>
    </Container>
  );
};

export default CustomFieldListOption;
