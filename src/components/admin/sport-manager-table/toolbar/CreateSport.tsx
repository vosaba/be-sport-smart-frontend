import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";

import { toSportKey } from "../../../../helpers/stringHelpers";
import { SportDto } from "../../../../services/core-admin/interfaces/SportDto";
import { SportManagerService } from "../../../../services/core-admin/SportManagerService";
import { LoadingOverlay } from "../../../common/LoadingOverlay";
import SportFormula from "../../SportFormula";
import SportVariablesTable from "../sport-variables/SportVariablesTable";

interface CreateSportProps {
  disabled: boolean;
  onSportTemplateReady: (sport: SportDto) => void;
  onSportCreate: (sport: SportDto) => void;
}

const sportManagerService = new SportManagerService();

const CreateSport: React.FC<CreateSportProps> = ({ disabled, onSportCreate, onSportTemplateReady }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [createDisabled, setCreateDisabled] = useState(false);
  const [sport, setSport] = useState<SportDto | null>(null);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShowTemplate(false);
  };

  useEffect(() => {
    const fetchSportTemplate = async () => {
      setIsLoading(true);
      const sportTemplate = await sportManagerService.getSportTemplate();
      setSport(sportTemplate);
      onSportTemplateReady(sportTemplate);
      setIsLoading(false);
    };

    if(!sport) {
      fetchSportTemplate();
    }
  }, []);

  const handleSportNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedSport = {
      ...sport!,
      name: toSportKey(event.target.value, false),
    };
    setSport(updatedSport);
  };

  const handleCreateDisabledChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreateDisabled(event.target.checked);
  };

  const handleVariableChange = useCallback(
    (_: string, variableKey: string, variableValue: number | string | boolean) => {
      if (!sport) return;

      const updatedVariables = {
        ...sport.variables,
        [variableKey]: variableValue,
      };
      const updatedSport = { ...sport, variables: updatedVariables };

      setSport(updatedSport);
    },
    []
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const sportToCreate = { ...sport!, name: toSportKey(sport!.name), disabled: createDisabled };
      const createdSport = await sportManagerService.createSport(
        { ...sportToCreate },
        createDisabled
      );

      enqueueSnackbar(`Sport '${sportToCreate.name}' created successfully!`, { variant: "success" });
      onSportCreate(createdSport);
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar("Failed to create sport", { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Box>
      <Button 
        variant="contained"
        color="primary"
        disabled={disabled}
        onClick={handleOpenDialog}
        startIcon={<PlusIcon/>}>
        Create
      </Button>
      <Dialog
        open={dialogOpen}
        scroll="paper"
        fullScreen={true}
        onClose={handleCloseDialog}
      >
        <LoadingOverlay open={isLoading} />
        <DialogTitle>Create Sport</DialogTitle>
        <Divider/>
        <DialogContent>
          <TextField
            label="Sport Key"
            value={sport?.name}
            size="small"
            placeholder="new_sport"
            onChange={handleSportNameChange}
            fullWidth
            margin="normal"
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={createDisabled}
                  onChange={handleCreateDisabledChange}
                />
              }
              label="Create disabled"
            />
            <Button
              variant="outlined"
              color="primary"
              size={"small"}
              onClick={() => setShowTemplate(!showTemplate)}
              sx={{ ml: 2 }}
            >
              { !showTemplate? "Show template" : "Hide template" }
            </Button>
          </Box>
          <Box mt={2}>
            {sport && (
              !showTemplate && (<SportVariablesTable
                sport={sport}
                handleVariableChange={handleVariableChange}
                updatedSports={{ current: {} }}
              />)
              || (<SportFormula sport={sport}/>)
            )}
          </Box>
        </DialogContent>
        <Divider/>
        <DialogActions sx={{ pl: "24px", pr: "24px", pb: "20px", pt: "20px" }}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button variant="outlined" color="secondary" size={"small"} onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" size={"small"} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateSport;
