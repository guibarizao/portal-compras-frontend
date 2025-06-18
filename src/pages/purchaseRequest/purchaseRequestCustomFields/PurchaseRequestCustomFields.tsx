import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { v4 as uuidv4 } from "uuid";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import IPurchaseRequestCustomField from "../../../interfaces/IPurchaseRequestCustomField";
import { usePurchaseRequestCustomFields } from "../../../hooks/purchaseRequestCustomFieldsSession";
import { useCustomFieldListOptionsService } from "../../../services/useCustomFieldListOptionsService";
import IPurchaseRequestCustomFieldListOption from "../../../interfaces/IPurchaseRequestCustomFieldListOption";
import ICustomFieldListOption from "../../../interfaces/ICustomFieldListOption";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const IntFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function IntFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={"."}
        decimalScale={0}
        decimalSeparator=","
        valueIsNumericString
      />
    );
  }
);

interface ICustomField extends IPurchaseRequestCustomField {
  disabled: boolean;
}

const CustomFieldInt: React.FC<ICustomField> = ({
  customField,
  value,
  id,
  disabled,
}) => {
  const [customFieldValue, setCustomFieldValue] = useState(value);

  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  useEffect(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    const index = purchaseRequestCustomFieldsSession.findIndex(
      (field) => field.id === id
    );

    purchaseRequestCustomFieldsSession[index].value = customFieldValue;

    updatePurchaseRequestCustomFieldsSession(
      purchaseRequestCustomFieldsSession
    );
  }, [customFieldValue]);

  return (
    <FormControl size="small" required key={id} sx={{ width: "100%" }}>
      <TextField
        sx={{ width: "100%" }}
        label={customField.description}
        value={customFieldValue}
        onChange={(event) => setCustomFieldValue(event.target.value)}
        name="value"
        size="small"
        id="decimal-input"
        InputProps={{
          inputComponent: IntFormatCustom as any,
        }}
        variant="outlined"
        required={customField.isRequired}
        disabled={disabled}
      />
    </FormControl>
  );
};

const DecimalFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function DecimalFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={"."}
        decimalScale={2}
        decimalSeparator=","
        valueIsNumericString
      />
    );
  }
);

const CustomFieldDecimal: React.FC<ICustomField> = ({
  customField,
  value,
  id,
  disabled,
}) => {
  const [customFieldValue, setCustomFieldValue] = useState(value);

  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  useEffect(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    const index = purchaseRequestCustomFieldsSession.findIndex(
      (field) => field.id === id
    );

    purchaseRequestCustomFieldsSession[index].value = customFieldValue;

    updatePurchaseRequestCustomFieldsSession(
      purchaseRequestCustomFieldsSession
    );
  }, [customFieldValue]);

  return (
    <FormControl size="small" required key={id} sx={{ width: "100%" }}>
      <TextField
        sx={{ width: "100%" }}
        label={customField.description}
        value={customFieldValue}
        onChange={(event) => setCustomFieldValue(event.target.value)}
        name="value"
        size="small"
        id="decimal-input"
        InputProps={{
          inputComponent: DecimalFormatCustom as any,
        }}
        variant="outlined"
        required={customField.isRequired}
        disabled={disabled}
      />
    </FormControl>
  );
};

const CustomFieldString: React.FC<ICustomField> = ({
  customField,
  value,
  id,
  disabled,
}) => {
  const [customFieldValue, setCustomFieldValue] = useState(value || "");

  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  useEffect(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    const index = purchaseRequestCustomFieldsSession.findIndex(
      (field) => field.id === id
    );

    purchaseRequestCustomFieldsSession[index].value = customFieldValue;

    updatePurchaseRequestCustomFieldsSession(
      purchaseRequestCustomFieldsSession
    );
  }, [customFieldValue]);

  return (
    <TextField
      sx={{ width: "100%" }}
      key={id}
      size="small"
      label={customField.description}
      value={customFieldValue}
      onChange={(e) => setCustomFieldValue(e.target.value)}
      disabled={disabled}
    />
  );
};

const CustomFieldDate: React.FC<ICustomField> = ({
  customField,
  value,
  id,
  disabled,
}) => {
  const [customFieldValue, setCustomFieldValue] = useState<Dayjs | null>(() => {
    if (value) {
      const isValidDate = dayjs(value, "YYYY-MM-DD").isValid();

      if (isValidDate) {
        return dayjs(value);
      } else {
        return null;
      }
    } else {
      return null;
    }
  });

  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  useEffect(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    const index = purchaseRequestCustomFieldsSession.findIndex(
      (field) => field.id === id
    );

    purchaseRequestCustomFieldsSession[index].value = customFieldValue
      ? customFieldValue?.format("YYYY-MM-DD")
      : null;

    updatePurchaseRequestCustomFieldsSession(
      purchaseRequestCustomFieldsSession
    );
  }, [customFieldValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DatePicker
        disabled={disabled}
        sx={{ width: "100%" }}
        slotProps={{ textField: { size: "small" } }}
        label={`${customField.description}${
          customField.isRequired ? " *" : ""
        }`}
        value={customFieldValue}
        onChange={(value) => setCustomFieldValue(dayjs(String(value)))}
      />
    </LocalizationProvider>
  );
};

const CustomFieldBoolean: React.FC<ICustomField> = ({
  customField,
  value,
  id,
  disabled,
}) => {
  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  const [customFieldValue, setCustomFieldValue] = useState(
    value === "true" ? true : false
  );

  useEffect(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    const index = purchaseRequestCustomFieldsSession.findIndex(
      (field) => field.id === id
    );

    purchaseRequestCustomFieldsSession[index].value = String(customFieldValue);

    updatePurchaseRequestCustomFieldsSession(
      purchaseRequestCustomFieldsSession
    );
  }, [customFieldValue]);

  return (
    <FormControlLabel
      label={customField.description}
      control={
        <Checkbox
          checked={customFieldValue}
          onChange={() => {
            setCustomFieldValue(!customFieldValue);
          }}
        />
      }
      disabled={disabled}
    />
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IOption {
  id: string;
  name: string;
  selected: boolean;
  sequence: number;
}

const CustomFieldList: React.FC<ICustomField> = ({
  customField,
  disabled,
  id,
  purchaseRequestId,
  customFieldId,
}) => {
  const {
    getPurchaseRequestCustomFieldsSession,
    updatePurchaseRequestCustomFieldsSession,
  } = usePurchaseRequestCustomFields();

  const { findCustomFieldListOption } = useCustomFieldListOptionsService();

  const [options, setOptions] = useState<IOption[]>([]);
  const [customFieldListOptions, setCustomFieldListOption] = useState<
    ICustomFieldListOption[]
  >([]);
  const [purchaseRequestCustomFieldCurrent] = useState(() => {
    const purchaseRequestCustomFieldsSession =
      getPurchaseRequestCustomFieldsSession();

    return purchaseRequestCustomFieldsSession.find(
      (purchaseRequestCustomField) =>
        purchaseRequestCustomField.customFieldId === customField.id
    );
  });

  const [customFieldValue, setCustomFieldValue] = useState<string[]>(() => {
    if (customField.listType === "SIMPLE") {
      return ["Não selecionado"];
    }
    return [];
  });

  const handleUpdateSession = useCallback(
    (customValueSelecteds: string[]) => {
      const customFieldListOptionSelecteds = options.filter((option) =>
        customValueSelecteds.some((value) => value === option.name)
      );

      if (purchaseRequestCustomFieldCurrent) {
        const purchaseRequestCustomFieldsSession =
          getPurchaseRequestCustomFieldsSession();

        const optionsSelecteds = customFieldListOptionSelecteds.map(
          (optionSelected) => {
            const option: IPurchaseRequestCustomFieldListOption = {
              id: uuidv4(),
              customFieldId,
              customFieldListOptionId: optionSelected.id,
              purchaseRequestCustomFieldId: id,
              purchaseRequestId: purchaseRequestId,
              selected: true,
              customFieldListOption: customFieldListOptions.find(
                (customFieldListOption) =>
                  customFieldListOption.id === optionSelected.id
              ),
            };

            return option;
          }
        );

        const index = purchaseRequestCustomFieldsSession.findIndex(
          (field) => field.id === id
        );

        purchaseRequestCustomFieldsSession[
          index
        ].purchaseRequestCustomFieldListOptions = optionsSelecteds;

        updatePurchaseRequestCustomFieldsSession(
          purchaseRequestCustomFieldsSession
        );
      }
    },
    [options]
  );

  const handleChange = (event: SelectChangeEvent<typeof customFieldValue>) => {
    const value = event.target.value;

    const selectedOptions =
      typeof value === "string" ? value.split("|") : value;

    setCustomFieldValue(selectedOptions);
    handleUpdateSession(selectedOptions);
  };

  const handleLoadSelectedValues = () => {
    if (purchaseRequestCustomFieldCurrent) {
      let selectedFefault: string[] = [];
      purchaseRequestCustomFieldCurrent.purchaseRequestCustomFieldListOptions.forEach(
        (purchaseRequestCustomField) => {
          if (purchaseRequestCustomField.selected) {
            if (customField.listType === "SIMPLE") {
              setCustomFieldValue([
                purchaseRequestCustomField.customFieldListOption?.description ||
                  "",
              ]);
            }

            if (customField.listType === "MULTIPLE") {
              selectedFefault.push(
                purchaseRequestCustomField.customFieldListOption?.description ||
                  ""
              );
            }
          }
        }
      );

      if (customField.listType === "MULTIPLE") {
        setCustomFieldValue(selectedFefault);
      }
    }
  };

  const handleFindOptionsAndCustomFieldListOptions = useCallback(async () => {
    if (customField.id) {
      await findCustomFieldListOption(customField.id).then((resource) => {
        const formatedOptions: IOption[] = [];

        if (customField.listType === "SIMPLE") {
          formatedOptions.push({
            id: "",
            name: "Não selecionado",
            selected: true,
            sequence: 0,
          });
        }

        resource?.forEach((option) => {
          formatedOptions.push({
            id: option.id,
            name: option.description,
            selected: option.selectedDefault,
            sequence: option.sequence,
          });
        });

        setOptions(formatedOptions);
        setCustomFieldListOption(resource);
      });
    }
  }, [customField]);

  useEffect(() => {
    handleFindOptionsAndCustomFieldListOptions();
    handleLoadSelectedValues();
  }, []);

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel
        id="multiple-checkbox-label"
        size="small"
        disabled={disabled}
        required={customField.isRequired}
      >
        {customField.description}
      </InputLabel>
      <Select
        labelId="multiple-checkbox-label"
        id="multiple-checkbox"
        multiple={customField.listType === "MULTIPLE"}
        value={customFieldValue}
        onChange={handleChange}
        input={<OutlinedInput label={customField.description} />}
        renderValue={(selected) => selected.join(" | ")}
        MenuProps={MenuProps}
        size="small"
        disabled={disabled}
        required={customField.isRequired}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {customField.listType === "MULTIPLE" && (
                <Checkbox
                  checked={customFieldValue.indexOf(option.name) > -1}
                />
              )}
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

interface IPurchaseRequestCustomFieldsProps {
  isDraft: boolean;
}

const PurchaseRequestCustomFieldsArea: React.FC<
  IPurchaseRequestCustomFieldsProps
> = ({ isDraft }) => {
  const { getPurchaseRequestCustomFieldsSession } =
    usePurchaseRequestCustomFields();

  const [purchaseRequestCustomFieldsSession] = useState(() =>
    getPurchaseRequestCustomFieldsSession()
  );

  return (
    <>
      {purchaseRequestCustomFieldsSession.map((purchaseRequestCustomField) => {
        if (purchaseRequestCustomField.customField.typeId === 1) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldInt
                disabled={!isDraft}
                key={purchaseRequestCustomField.id}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={[]}
              />
            </Grid>
          );
        } else if (purchaseRequestCustomField.customField.typeId === 2) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldDecimal
                disabled={!isDraft}
                key={purchaseRequestCustomField.id}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={[]}
              />
            </Grid>
          );
        } else if (purchaseRequestCustomField.customField.typeId === 3) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldString
                disabled={!isDraft}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={[]}
              />
            </Grid>
          );
        } else if (purchaseRequestCustomField.customField.typeId === 4) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldDate
                disabled={!isDraft}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={[]}
              />
            </Grid>
          );
        } else if (purchaseRequestCustomField.customField.typeId === 5) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldBoolean
                disabled={!isDraft}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={[]}
              />
            </Grid>
          );
        } else if (purchaseRequestCustomField.customField.typeId === 6) {
          return (
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              key={purchaseRequestCustomField.id}
            >
              <CustomFieldList
                disabled={!isDraft}
                customField={purchaseRequestCustomField.customField}
                value={purchaseRequestCustomField.value}
                customFieldId={purchaseRequestCustomField.customFieldId}
                id={purchaseRequestCustomField.id}
                purchaseRequestId={purchaseRequestCustomField.purchaseRequestId}
                purchaseRequestCustomFieldListOptions={
                  purchaseRequestCustomField.purchaseRequestCustomFieldListOptions
                }
              />
            </Grid>
          );
        }

        return <span key={purchaseRequestCustomField.id}>Campo inválido</span>;
      })}
    </>
  );
};

export default PurchaseRequestCustomFieldsArea;
