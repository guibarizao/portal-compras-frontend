import React from "react";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";

export interface IOption {
  value: string;
  description: string;
}

interface IProps {
  options: IOption[];
  asyncSearch: (filter?: string) => Promise<void>;
  setOptions: (options: IOption[]) => void;
  setOption: (option: IOption | null) => void;
  label?: string;
  loading: boolean;
  option: IOption | null;
  error: boolean;
  errorMessage: string | null;
  disabled?: boolean;
  required?: boolean;
  autofocus?: boolean;
}

const AsyncSearch = ({
  options,
  loading,
  option,
  error,
  errorMessage,
  label,
  asyncSearch,
  setOption,
  setOptions,
  disabled,
  required = false,
  autofocus = false,
}: IProps) => {
  const [open, setOpen] = React.useState(false);

  const loadingInput = open;

  React.useEffect(() => {
    let active = true;

    if (!loadingInput) {
      return undefined;
    }

    (async () => {
      if (active) {
        await asyncSearch("");
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingInput]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <div>
      {
        <Autocomplete
          autoFocus={autofocus}
          disabled={disabled}
          open={open}
          value={option}
          onChange={(e: any, newValue) => {
            const castedOption = { ...newValue } as IOption;
            setOption({ ...castedOption });
          }}
          onOpen={() => {
            setOpen(true);
            asyncSearch(option?.description);
            setOption(null);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => {
            return option?.description === value?.description || true;
          }}
          getOptionLabel={(option) =>
            option?.description ? `${option.description}` : ""
          }
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label || "Pesquisar"}
              error={error || false}
              helperText={errorMessage || ""}
              size="small"
              onFocus={() => asyncSearch("")}
              onChange={(e) => asyncSearch(e.target.value)}
              required={required}
              autoFocus={autofocus}
              InputProps={{
                ...params?.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params?.InputProps?.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      }
    </div>
  );
};

export default AsyncSearch;
